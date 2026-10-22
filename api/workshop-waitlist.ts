import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomInt } from "crypto";

// Waiting list do workshop de churrasco (lisbonbbq.pt/workshop).
//
// POST: inscreve na lista, gera o código de convite pessoal e envia o email de
//       boas-vindas com o convite ("traz um camarada"). Se a inscrição vier de um
//       convite (?c=CODIGO), liga as duas pessoas e fixa o preço de convite.
// GET ?task=reminders: cron diário de lembretes (ver runReminders).
// GET ?c=CODIGO: valida um código e devolve o primeiro nome de quem convidou,
//       para a página mostrar "O Rui guardou-te um lugar".
//
// Os preços vivem aqui (e não no cliente) para ninguém escolher o próprio preço.
// Têm de ficar iguais a WORKSHOP_PRICES em components/WorkshopView.tsx — a Vercel
// empacota cada função de api/ isoladamente e não traça imports de fora.
const PRICES: Record<string, { public: number; invite: number }> = {
  a: { public: 110, invite: 90 },
  b: { public: 95, invite: 80 },
};

const SITE = "https://lisbonbbq.pt";
const FROM = "LisbonBBQ <noreply@lisbonbbq.pt>";
const REPLY_TO = "pitmasters@lisbonbbq.pt";
const NOTIFY_EMAIL = "pitmasters@lisbonbbq.pt";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const CONSENT_TEXT =
  "Autorizo a Lisbon BBQ a guardar estes dados para me contactar sobre o workshop de churrasco da Lisbon BBQ, de acordo com o RGPD. Posso pedir para os apagar a qualquer momento em pitmasters@lisbonbbq.pt.";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text: string | undefined | null) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const firstName = (name: string) => (name || "").trim().split(/\s+/)[0] || "";

function newCode() {
  let c = "";
  for (let i = 0; i < 6; i++) c += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return c;
}

function cleanCode(raw: unknown) {
  const c = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.length === 6 ? c : null;
}

function str(v: unknown, max = 200) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function inviteLink(code: string) {
  return `${SITE}/workshop?c=${code}`;
}

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #F9F7F2; margin: 0; padding: 24px; color: #1A1A1A; }
  .card { background: #fff; border: 4px solid #1A1A1A; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #D91A2A; color: #fff; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; text-transform: uppercase; border-bottom: 4px solid #1A1A1A; }
  p { font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
  .box { background: #F4B41A; border: 3px solid #1A1A1A; padding: 20px; margin: 24px 0; }
  .box p { margin: 0 0 12px; }
  .btn { display: inline-block; background: #1A1A1A; color: #F4B41A !important; text-decoration: none; font-weight: bold; text-transform: uppercase; padding: 14px 22px; letter-spacing: 1px; }
  .link { font-size: 13px; word-break: break-all; color: #1A1A1A; }
  .footer { margin-top: 32px; font-size: 13px; color: #6B7280; border-top: 1px solid #eee; padding-top: 16px; }
</style></head><body><div class="card">
  <h1>${title}</h1>
  ${body}
  <div class="footer">Lisbon Barbecue &amp; Churrasco · Lisboa · <a href="${SITE}" style="color:#6B7280">lisbonbbq.pt</a><br>
  Recebes este email porque entraste na waiting list do workshop. Para deixares de receber, responde com "sair".</div>
</div></body></html>`;
}

function inviteBox(code: string, p: { public: number; invite: number }) {
  const link = inviteLink(code);
  return `<div class="box">
    <p><strong>Tens um convite para oferecer.</strong> Quem se inscrever com o teu link fica na tua estação de grelha, e os dois pagam <strong>${p.invite}€ em vez de ${p.public}€</strong>.</p>
    <p>Vale para quantos camaradas quiseres. Cada um paga ${p.invite}€, e tu também.</p>
    <p style="margin:16px 0 8px"><a class="btn" href="${link}">Partilhar o meu convite</a></p>
    <p class="link" style="margin:0">${link}</p>
  </div>`;
}

function welcomeEmail(row: any, p: { public: number; invite: number }, inviterFirst?: string) {
  const fn = escapeHtml(firstName(row.name));
  const viaInvite = inviterFirst
    ? `<p>Entraste pelo convite de <strong>${escapeHtml(inviterFirst)}</strong>: o teu lugar fica a <strong>${p.invite}€</strong>, na mesma estação de grelha.</p>`
    : "";
  return layout(
    "Estás na lista",
    `<p>${fn}, já estás na waiting list do workshop de churrasco da Lisbon BBQ.</p>
     ${viaInvite}
     <p>Quando abrirmos as datas de novembro e dezembro, avisamos-te primeiro: tens 48 horas de prioridade antes de abrirmos ao público. Não pagas nada agora.</p>
     ${inviteBox(row.invite_code, p)}
     <p>Até à brasa,<br><strong>Equipa LisbonBBQ</strong></p>`
  );
}

function inviterJoinedEmail(inviter: any, invitee: any, p: { public: number; invite: number }) {
  return layout(
    "O teu camarada entrou",
    `<p>${escapeHtml(firstName(inviter.name))}, <strong>${escapeHtml(firstName(invitee.name))}</strong> entrou na waiting list com o teu convite.</p>
     <p>Ficam na mesma estação de grelha e os dois pagam <strong>${p.invite}€</strong> em vez de ${p.public}€. Avisamos-vos quando abrirem as datas.</p>
     <p>O convite continua a valer para mais camaradas: <a href="${inviteLink(inviter.invite_code)}">${inviteLink(inviter.invite_code)}</a></p>
     <p>Até à brasa,<br><strong>Equipa LisbonBBQ</strong></p>`
  );
}

function internalEmail(row: any, inviter: any | null) {
  const rows: [string, string][] = [
    ["Nome", row.name],
    ["Email", row.email],
    ["Telemóvel", row.phone],
    ["Horário", row.preferred_slot],
    ["Já grelha?", row.experience],
    ["O que o traz", row.motive],
    ["Como soube", row.heard_from || "—"],
    ["Convidado por", inviter ? `${inviter.name} (${inviter.email})` : "—"],
    ["Preço", `${row.locked_price ?? row.public_price}€ (variante ${row.price_variant})`],
    ["UTM", row.utm ? JSON.stringify(row.utm) : "—"],
    ["Código", row.invite_code],
  ];
  return `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold;color:#555">${k}</td><td style="padding:6px 12px">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;
}

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


async function runReminders(req: any, res: any) {
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
        const { error: sendError } = await resend.emails.send({
          from: FROM, to: row.email, replyTo: REPLY_TO,
          subject: "O teu camarada ainda vai a tempo",
          html: reminderEmail(row),
        });
        if (sendError) throw sendError;
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

export default async function handler(req: any, res: any) {
  // Cron diário (vercel.json → crons): lembrete aos 3 dias. Vive neste ficheiro
  // porque o plano Hobby da Vercel limita o deploy a 12 funções em api/.
  if (req.method === "GET" && req.query?.task === "reminders") return runReminders(req, res);

  if (req.method === "GET") {
    const code = cleanCode(req.query?.c);
    if (!code) return res.status(200).json({ valid: false });
    const { data } = await supabase
      .from("workshop_waitlist")
      .select("name, price_variant")
      .eq("invite_code", code)
      .maybeSingle();
    if (!data) return res.status(200).json({ valid: false });
    const p = PRICES[data.price_variant] || PRICES.a;
    return res.status(200).json({ valid: true, firstName: firstName(data.name), invitePrice: p.invite, publicPrice: p.public });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const b = req.body || {};

  // Honeypot: campo escondido que só bots preenchem.
  if (str(b.website)) return res.status(200).json({ ok: true });

  const name = str(b.name, 120);
  const email = str(b.email, 200).toLowerCase();
  const phone = str(b.phone, 40);
  const preferred_slot = str(b.preferredSlot, 60);
  const experience = str(b.experience, 60);
  const motive = str(b.motive, 60);
  const heard_from = str(b.heardFrom, 60);
  const consent = b.consent === true;

  const errors: string[] = [];
  if (!name) errors.push("nome");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (phone.replace(/\D/g, "").length < 9) errors.push("telemóvel");
  if (!preferred_slot) errors.push("horário");
  if (!experience) errors.push("experiência");
  if (!motive) errors.push("motivo");
  if (!consent) errors.push("consentimento");
  if (errors.length) return res.status(400).json({ error: "invalid", fields: errors });

  const variant = PRICES[b.priceVariant] ? String(b.priceVariant) : "a";
  const prices = PRICES[variant];

  // Convite: só conta se o código existir.
  let inviter: any = null;
  const code = cleanCode(b.inviteCode);
  if (code) {
    const { data } = await supabase
      .from("workshop_waitlist")
      .select("id, name, email, invite_code, price_variant, locked_price, public_price, invite_price")
      .eq("invite_code", code)
      .maybeSingle();
    if (data && data.email.toLowerCase() !== email) inviter = data;
  }
  // Quem entra por convite fica com os preços da variante de quem convidou.
  const effective = inviter ? PRICES[inviter.price_variant] || prices : prices;

  // Já inscrito? Não duplica nem reenvia nada.
  const { data: existing } = await supabase
    .from("workshop_waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return res.status(200).json({ ok: true, duplicate: true, firstName: firstName(name) });

  const utm = b.utm && typeof b.utm === "object" ? b.utm : null;

  let row: any = null;
  for (let attempt = 0; attempt < 5 && !row; attempt++) {
    const { data, error } = await supabase
      .from("workshop_waitlist")
      .insert({
        name, email, phone, preferred_slot, experience, motive, heard_from,
        consent, consent_at: new Date().toISOString(), consent_text: CONSENT_TEXT,
        invite_code: newCode(),
        invited_by: inviter?.id ?? null,
        price_variant: inviter ? inviter.price_variant : variant,
        public_price: effective.public,
        invite_price: effective.invite,
        locked_price: inviter ? effective.invite : null,
        utm,
        landing_url: str(b.landingUrl, 500) || null,
        referrer: str(b.referrer, 500) || null,
      })
      .select("*")
      .single();
    if (data) row = data;
    else if (error && error.code !== "23505") {
      console.error("[workshop] insert error:", error);
      return res.status(500).json({ error: "save_failed" });
    } else if (error && /email/.test(error.message || "")) {
      return res.status(200).json({ ok: true, duplicate: true, firstName: firstName(name) });
    }
  }
  if (!row) return res.status(500).json({ error: "save_failed" });

  if (inviter && !inviter.locked_price) {
    await supabase.from("workshop_waitlist").update({ locked_price: effective.invite }).eq("id", inviter.id);
  }

  // Emails: uma falha aqui não desfaz a inscrição.
  try {
    // O SDK do Resend devolve { error } em vez de lançar exceção.
    const { error: sendError } = await resend.emails.send({
      from: FROM, to: email, replyTo: REPLY_TO,
      subject: inviter ? `${firstName(inviter.name)} guardou-te um lugar na grelha` : "Estás na lista. Guarda um lugar para um camarada",
      html: welcomeEmail(row, effective, inviter ? firstName(inviter.name) : undefined),
    });
    if (sendError) throw sendError;
    await supabase.from("workshop_waitlist").update({ welcome_sent_at: new Date().toISOString() }).eq("id", row.id);
  } catch (e) {
    console.error("[workshop] welcome email failed:", e);
  }
  if (inviter) {
    try {
      await resend.emails.send({
        from: FROM, to: inviter.email, replyTo: REPLY_TO,
        subject: `${firstName(row.name)} entrou com o teu convite`,
        html: inviterJoinedEmail(inviter, row, effective),
      });
    } catch (e) {
      console.error("[workshop] inviter email failed:", e);
    }
  }
  try {
    await resend.emails.send({
      from: FROM, to: NOTIFY_EMAIL,
      subject: `🔥 Waiting list workshop: ${row.name}${inviter ? " (convite)" : ""}`,
      html: internalEmail(row, inviter),
    });
  } catch (e) {
    console.error("[workshop] internal email failed:", e);
  }

  return res.status(200).json({ ok: true, firstName: firstName(row.name), inviteCode: row.invite_code, invited: !!inviter });
}
