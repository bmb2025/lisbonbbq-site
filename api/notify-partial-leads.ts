import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { FROM, NOTIFY_EMAIL, internalEmail } from "../lib/leadEmails";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

// Minutes a partial lead (name + phone only) waits before we notify the team —
// gives the client time to finish the form. If they complete, the normal
// notification already fired and we skip the partial one (no duplicates).
const WAIT_MINUTES = 5;

/**
 * Triggered on a schedule (Supabase pg_cron). Finds partial leads that are older
 * than WAIT_MINUTES and not yet notified, and — unless the same person has since
 * completed the form — sends the team an "incomplete lead" email with whatever
 * data the site managed to collect. Idempotent: every processed row is stamped
 * with `partial_notified_at` so it is never emailed twice.
 *
 * Discriminator: partial leads have a NULL top-level `email` column (the email is
 * only collected on the final submission); completed/corporate leads do not.
 */
export default async function handler(req: any, res: any) {
  const secret = req.headers?.["x-cron-secret"];
  if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = Date.now();
  const dueBefore = new Date(now - WAIT_MINUTES * 60 * 1000).toISOString();
  const completedSince = new Date(now - 6 * 60 * 60 * 1000).toISOString();

  try {
    // Partial leads old enough to act on and not yet processed.
    const { data: partials, error: pErr } = await supabase
      .from("leads")
      .select("id, created_at, data")
      .is("email", null)
      .is("partial_notified_at", null)
      .lte("created_at", dueBefore);
    if (pErr) throw pErr;

    if (!partials || partials.length === 0) {
      return res.json({ ok: true, due: 0, notified: 0, skipped: 0 });
    }

    // Phones of anyone who completed (email present) in the recent window.
    const { data: completed, error: cErr } = await supabase
      .from("leads")
      .select("data, created_at")
      .not("email", "is", null)
      .gte("created_at", completedSince);
    if (cErr) throw cErr;

    const completedPhones = new Set(
      (completed || []).map((r: any) => r.data?.client?.phone).filter(Boolean)
    );

    let notified = 0;
    let skipped = 0;

    for (const row of partials) {
      const lead = row.data || {};
      const phone = lead?.client?.phone;
      const completedForm = phone && completedPhones.has(phone);

      if (!completedForm) {
        const notifyTo = lead?.target_email || NOTIFY_EMAIL;
        try {
          await resend.emails.send({
            from: FROM,
            to: notifyTo,
            subject: `⏳ Lead incompleta — ${lead?.client?.name || phone || "sem nome"}`,
            html: internalEmail(lead, { incomplete: true }),
          });
          notified++;
        } catch (mailErr) {
          console.error("[PartialLeads] Resend error:", mailErr);
          // leave partial_notified_at unset so the next run retries this one
          continue;
        }
      } else {
        skipped++;
      }

      await supabase
        .from("leads")
        .update({ partial_notified_at: new Date().toISOString() })
        .eq("id", row.id);
    }

    return res.json({ ok: true, due: partials.length, notified, skipped });
  } catch (err: any) {
    console.error("[PartialLeads] failed:", err);
    return res.status(500).json({ ok: false, error: err?.message || "error" });
  }
}
