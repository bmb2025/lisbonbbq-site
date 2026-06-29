import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { FROM, NOTIFY_EMAIL, internalEmail, confirmationEmail } from "../lib/leadEmails";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Early capture (name + phone collected before the extras step): persist to the
  // database only. The confirmation/notification emails are sent on the final
  // submission, once the client provides their email and chooses extras.
  if (leadData?.stage === "partial") {
    return res.json({ success: true, stage: "partial", message: "Lead parcial guardada." });
  }

  // 2. Send emails via Resend
  try {
    const notifyTo = leadData?.target_email || NOTIFY_EMAIL;
    // Client confirmation follows the language of the site the lead came from.
    const lang: "pt" | "en" = leadData?.lang === "en" ? "en" : "pt";
    const clientSubject = lang === "en"
      ? "LisbonBBQ — Request received 🔥"
      : "LisbonBBQ — Pedido recebido 🔥";

    await Promise.all([
      // Internal notification (kept in PT — read by the LisbonBBQ team)
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
        subject: clientSubject,
        html: confirmationEmail(leadData, lang),
      })] : []),
    ]);

    console.log("[Lead] Emails sent via Resend");
  } catch (err) {
    // Email failure doesn't block the response — lead is already saved
    console.error("[Lead] Resend error:", err);
  }

  return res.json({ success: true, message: "Lead recebida e processada." });
}
