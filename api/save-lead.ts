import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Change to noreply@lisbonbbq.pt once domain is verified in Resend
const FROM = "LisbonBBQ <noreply@lisbonbbq.pt>";
const NOTIFY_EMAIL = "forge@thefuture.pt";

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-PT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

function traditionLabel(t: string) {
  return { brazilian: "Churrasco Brasileiro 🇧🇷", portuguese: "Churrasco Português 🇵🇹", argentinian: "Asado Argentino 🇦🇷" }[t] || t;
}

function internalEmail(lead: any) {
  const b = lead.booking || {};
  const c = lead.client || {};
  const extras = (lead.extras || []).map((e: any) => `${e.name} ×${e.qty}`).join(", ") || "Nenhum";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  .card { background: #fff; border: 3px solid #111; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #FFD600; color: #111; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; border-bottom: 3px solid #111; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 15px; }
  td:first-child { font-weight: bold; width: 40%; color: #555; }
  .badge { display: inline-block; background: #FFD600; border: 2px solid #111; padding: 4px 12px; font-weight: bold; border-radius: 4px; }
</style></head>
<body>
<div class="card">
  <h1>🔥 Nova Reserva — LisbonBBQ</h1>
  <table>
    <tr><td>Cliente</td><td>${c.name || "—"}</td></tr>
    <tr><td>Email</td><td><a href="mailto:${c.email}">${c.email || "—"}</a></td></tr>
    <tr><td>Telefone</td><td>${c.phone || "—"}</td></tr>
    <tr><td>Data do Evento</td><td>${formatDate(b.date)}</td></tr>
    <tr><td>Local</td><td>${lead.summary?.location || b.locationId || "—"}</td></tr>
    <tr><td>Tradição</td><td><span class="badge">${traditionLabel(b.tradition)}</span></td></tr>
    <tr><td>Horário</td><td>${b.slot || "—"}</td></tr>
    <tr><td>Convidados</td><td>${b.guests || "—"} pax</td></tr>
    <tr><td>Extras</td><td>${extras}</td></tr>
    <tr><td>ID</td><td style="font-size:12px;color:#999">${lead.id}</td></tr>
  </table>
</div>
</body>
</html>`;
}

function confirmationEmail(lead: any) {
  const b = lead.booking || {};
  const c = lead.client || {};

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  .card { background: #fff; border: 3px solid #111; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #FFD600; color: #111; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; border-bottom: 3px solid #111; }
  p { font-size: 16px; line-height: 1.6; color: #333; }
  .highlight { background: #FFF9C4; border-left: 4px solid #FFD600; padding: 16px; margin: 20px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 15px; }
  td:first-child { font-weight: bold; width: 40%; color: #555; }
  .footer { margin-top: 32px; font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
</style></head>
<body>
<div class="card">
  <h1>🔥 Pedido recebido — LisbonBBQ</h1>
  <p>Olá <strong>${c.name?.split(" ")[0] || ""}!</strong></p>
  <p>Recebemos o teu pedido de reserva. A nossa equipa vai entrar em contacto em breve para confirmar os detalhes e enviar proposta.</p>
  <div class="highlight">
    <table>
      <tr><td>Data</td><td>${formatDate(b.date)}</td></tr>
      <tr><td>Local</td><td>${lead.summary?.location || b.locationId || "—"}</td></tr>
      <tr><td>Tradição</td><td>${traditionLabel(b.tradition)}</td></tr>
      <tr><td>Horário</td><td>${b.slot || "—"}</td></tr>
      <tr><td>Convidados</td><td>${b.guests || "—"} pax</td></tr>
    </table>
  </div>
  <p>Qualquer dúvida responde a este email ou contacta-nos diretamente.</p>
  <p>Obrigado,<br><strong>Equipa LisbonBBQ</strong></p>
  <div class="footer">LisbonBBQ · Lisboa, Portugal · lisbonbbq.pt</div>
</div>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const leadData = req.body;
  const email = leadData?.client?.email || leadData?.email || null;
  const source = leadData?.source || "direct";

  console.log(`[Lead] New submission — email: ${email}, source: ${source}`);

  // 1. Save to Supabase
  try {
    const { error } = await supabase.from("leads").insert({
      data: leadData,
      source,
      email,
    });
    if (error) {
      console.error("[Lead] Supabase error:", error);
      throw error;
    }
    console.log("[Lead] Saved to Supabase");
  } catch (err) {
    console.error("[Lead] Supabase failed:", err);
    return res.status(500).json({ success: false, error: "Database error" });
  }

  // 2. Send emails via Resend
  try {
    const notifyTo = leadData?.target_email || NOTIFY_EMAIL;

    await Promise.all([
      // Internal notification
      resend.emails.send({
        from: FROM,
        to: notifyTo,
        subject: `🔥 Nova reserva — ${leadData?.client?.name || email}`,
        html: internalEmail(leadData),
      }),
      // Client confirmation (only if we have their email)
      ...(email ? [resend.emails.send({
        from: FROM,
        to: email,
        subject: "LisbonBBQ — Pedido recebido 🔥",
        html: confirmationEmail(leadData),
      })] : []),
    ]);

    console.log("[Lead] Emails sent via Resend");
  } catch (err) {
    // Email failure doesn't block the response — lead is already saved
    console.error("[Lead] Resend error:", err);
  }

  return res.json({ success: true, message: "Lead recebida e processada." });
}
