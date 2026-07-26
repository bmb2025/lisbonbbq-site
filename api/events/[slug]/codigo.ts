import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "LisbonBBQ <noreply@lisbonbbq.pt>";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Código pessoal e rastreável ao evento de origem: prefixo do slug + 4
// caracteres aleatórios. Usado só quando o evento não tem um referral_code
// fixo definido (ex.: código estático "SOFIA40" partilhado por todos).
function generateCode(slug: string) {
  const prefix = slug.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const suffix = randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `${prefix}-${suffix}`;
}

function codeEmail(event: any, code: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
  .card { background: #fff; border: 3px solid #111; max-width: 600px; margin: 0 auto; padding: 32px; text-align: center; }
  h1 { background: #F4B41A; color: #111; margin: -32px -32px 24px; padding: 20px 32px; font-size: 22px; border-bottom: 3px solid #111; text-align: left; }
  p { font-size: 16px; line-height: 1.6; color: #333; }
  .code { display: inline-block; background: #111; color: #F4B41A; font-size: 28px; font-weight: 900; letter-spacing: 2px; padding: 14px 24px; margin: 16px 0; }
  .footer { margin-top: 32px; font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 16px; text-align: left; }
</style></head>
<body>
<div class="card">
  <h1>🔥 O teu código</h1>
  <p>Obrigado por teres estado no evento <strong>${event.title}</strong>. Aqui está o teu código de desconto:</p>
  <div class="code">${code}</div>
  <p>${event.referral_discount_eur}€ de desconto no teu próximo churrasco${event.referral_valid_until ? `, válido até ${new Date(event.referral_valid_until).toLocaleDateString("pt-PT", { timeZone: "Europe/Lisbon" })}` : ""}.</p>
  <p><a href="https://lisbonbbq.pt/#reservar">Pedir orçamento em lisbonbbq.pt</a></p>
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
  const { email } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Dados inválidos" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, slug, title, referral_code, referral_discount_eur, referral_valid_until")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (eventError) {
    console.error("[EventCodigo] Supabase error:", eventError);
    return res.status(500).json({ error: "Database error" });
  }
  if (!event) {
    return res.status(404).json({ error: "Not found" });
  }

  // Reenviar o mesmo código se a pessoa já o tinha pedido antes.
  const { data: existing } = await supabase
    .from("event_code_requests")
    .select("code")
    .eq("event_id", event.id)
    .eq("email", normalizedEmail)
    .maybeSingle();

  const code = event.referral_code || existing?.code || generateCode(event.slug);
  const now = new Date().toISOString();

  const { error: upsertError } = await supabase
    .from("event_code_requests")
    .upsert(
      { event_id: event.id, email: normalizedEmail, code, sent_at: now },
      { onConflict: "event_id,email" }
    );

  if (upsertError) {
    console.error("[EventCodigo] Upsert error:", upsertError);
    return res.status(500).json({ error: "Database error" });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: normalizedEmail,
      subject: `O teu código de desconto — ${event.title}`,
      html: codeEmail(event, code),
    });
  } catch (err) {
    console.error("[EventCodigo] Resend error:", err);
  }

  return res.json({ success: true });
}
