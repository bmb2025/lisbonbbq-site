import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "LisbonBBQ <noreply@lisbonbbq.pt>";
const NOTIFY_EMAIL = "pitmasters@lisbonbbq.pt";

const DIET_LABELS: Record<string, string> = {
  nenhuma: "Come de tudo",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  gluten: "Sem glúten",
  lactose: "Sem lactose",
  alergia: "Tem alergia",
};

function escapeHtml(text: string | undefined | null) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function internalEmail(event: any, diet: string, detail: string, email: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  .card { background: #fff; border: 3px solid #111; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #F4B41A; color: #111; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; border-bottom: 3px solid #111; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 15px; }
  td:first-child { font-weight: bold; width: 32%; color: #555; }
</style></head>
<body>
<div class="card">
  <h1>🌱 Resposta de dieta — ${escapeHtml(event.title)}</h1>
  <table>
    <tr><td>Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td>Restrição</td><td>${escapeHtml(DIET_LABELS[diet] || diet)}</td></tr>
    <tr><td>Detalhes</td><td>${escapeHtml(detail) || "—"}</td></tr>
    <tr><td>Evento</td><td>${escapeHtml(event.slug)}</td></tr>
  </table>
</div>
</body>
</html>`;
}

function confirmationEmail(event: any, diet: string, detail: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  .card { background: #fff; border: 3px solid #111; max-width: 600px; margin: 0 auto; padding: 32px; }
  h1 { background: #F4B41A; color: #111; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; border-bottom: 3px solid #111; }
  p { font-size: 16px; line-height: 1.6; color: #333; }
  .highlight { background: #FFF9C4; border-left: 4px solid #F4B41A; padding: 16px; margin: 20px 0; font-size: 15px; }
  .footer { margin-top: 32px; font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
</style></head>
<body>
<div class="card">
  <h1>🔥 Anotado — ${escapeHtml(event.title)}</h1>
  <p>Os pitmasters já sabem.</p>
  <div class="highlight">
    <strong>${escapeHtml(DIET_LABELS[diet] || diet)}</strong>
    ${detail ? `<br>${escapeHtml(detail)}` : ""}
  </div>
  <p>Podes alterar a tua resposta a qualquer momento, basta submeteres o formulário de novo com o mesmo email.</p>
  <p>Alergia grave? Fala directamente com os pitmasters: <a href="mailto:pitmasters@lisbonbbq.pt">pitmasters@lisbonbbq.pt</a> ou +351 961 058 571.</p>
  <div class="footer">LisbonBBQ · Lisboa, Portugal · lisbonbbq.pt</div>
</div>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const { email, diet, detail, marketingOptin } = req.body || {};

  if (!email || !isValidEmail(email) || !diet) {
    return res.status(400).json({ error: "Dados inválidos" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, slug, title")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (eventError) {
    console.error("[EventDieta] Supabase error:", eventError);
    return res.status(500).json({ error: "Database error" });
  }
  if (!event) {
    return res.status(404).json({ error: "Not found" });
  }

  const now = new Date().toISOString();
  const optin = !!marketingOptin;

  // Preserve the original optin_at if the guest already opted in previously and
  // resubmits still checked — otherwise this upsert would overwrite it with
  // "now" every time, undermining the audit trail of when consent was given.
  const { data: existing } = await supabase
    .from("event_diet_responses")
    .select("optin_at")
    .eq("event_id", event.id)
    .eq("email", normalizedEmail)
    .maybeSingle();

  const { error: upsertError } = await supabase
    .from("event_diet_responses")
    .upsert(
      {
        event_id: event.id,
        email: normalizedEmail,
        diet,
        detail: detail || null,
        marketing_optin: optin,
        optin_at: optin ? existing?.optin_at || now : null,
        optin_source: optin ? "event_page" : null,
        updated_at: now,
      },
      { onConflict: "event_id,email" }
    );

  if (upsertError) {
    console.error("[EventDieta] Upsert error:", upsertError);
    return res.status(500).json({ error: "Database error" });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        subject: `🌱 Dieta — ${event.title} — ${normalizedEmail}`,
        html: internalEmail(event, diet, detail, normalizedEmail),
      }),
      resend.emails.send({
        from: FROM,
        to: normalizedEmail,
        subject: `Anotado 🔥 — ${event.title}`,
        html: confirmationEmail(event, diet, detail),
      }),
    ]);
  } catch (err) {
    console.error("[EventDieta] Resend error:", err);
  }

  return res.json({ success: true });
}
