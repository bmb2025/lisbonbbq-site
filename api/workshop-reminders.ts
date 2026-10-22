import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Cron diário (vercel.json → crons): 3 dias depois da inscrição na waiting list
// do workshop, quem ainda não trouxe nenhum camarada recebe um lembrete com o
// link de convite. Cada pessoa recebe no máximo um lembrete (reminder_sent_at).
// A Vercel envia "Authorization: Bearer <CRON_SECRET>" nos pedidos do cron.

const SITE = "https://lisbonbbq.pt";
const FROM = "LisbonBBQ <noreply@lisbonbbq.pt>";
const REPLY_TO = "pitmasters@lisbonbbq.pt";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text: string | undefined | null) {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const firstName = (name: string) => (name || "").trim().split(/\s+/)[0] || "";

function reminderEmail(row: any) {
  const link = `${SITE}/workshop?c=${row.invite_code}`;
  return `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #F9F7F2; margin: 0; padding: 24px; color: #1A1A1A; }
  .card { background: #fff; border: 4px solid #1A1A1A; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #D91A2A; color: #fff; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; text-transform: uppercase; border-bottom: 4px solid #1A1A1A; }
  p { font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
  .btn { display: inline-block; background: #1A1A1A; color: #F4B41A !important; text-decoration: none; font-weight: bold; text-transform: uppercase; padding: 14px 22px; letter-spacing: 1px; }
  .footer { margin-top: 32px; font-size: 13px; color: #6B7280; border-top: 1px solid #eee; padding-top: 16px; }
</style></head><body><div class="card">
  <h1>O teu camarada ainda vai a tempo</h1>
  <p>${escapeHtml(firstName(row.name))}, o teu lugar na waiting list está guardado.</p>
  <p>O teu convite continua de pé: quem se inscrever com o teu link fica na tua estação de grelha, e os dois pagam <strong>${row.invite_price}€ em vez de ${row.public_price}€</strong>.</p>
  <p><a class="btn" href="${link}">Partilhar o meu convite</a></p>
  <p style="font-size:13px;word-break:break-all">${link}</p>
  <p>Até à brasa,<br><strong>Equipa LisbonBBQ</strong></p>
  <div class="footer">Lisbon Barbecue &amp; Churrasco · Lisboa · <a href="${SITE}" style="color:#6B7280">lisbonbbq.pt</a><br>
  Recebes este email porque entraste na waiting list do workshop. Para deixares de receber, responde com "sair".</div>
</div></body></html>`;
}

export default async function handler(req: any, res: any) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers?.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const { data: due, error } = await supabase
    .from("workshop_waitlist")
    .select("id, name, email, invite_code, public_price, invite_price, created_at")
    .is("reminder_sent_at", null)
    .is("invited_by", null)
    .eq("status", "waitlist")
    .lte("created_at", cutoff)
    .limit(100);
  if (error) {
    console.error("[workshop-reminders] query failed:", error);
    return res.status(500).json({ error: "query_failed" });
  }

  let sent = 0;
  for (const row of due || []) {
    // Já trouxe alguém? Então não precisa de lembrete; marca para não voltar a ver.
    const { count } = await supabase
      .from("workshop_waitlist")
      .select("id", { count: "exact", head: true })
      .eq("invited_by", row.id);
    if ((count || 0) === 0) {
      try {
        await resend.emails.send({
          from: FROM, to: row.email, replyTo: REPLY_TO,
          subject: "O teu camarada ainda vai a tempo",
          html: reminderEmail(row),
        });
        sent++;
      } catch (e) {
        console.error("[workshop-reminders] send failed:", row.id, e);
        continue;
      }
    }
    await supabase.from("workshop_waitlist").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
  }

  return res.status(200).json({ checked: (due || []).length, sent });
}
