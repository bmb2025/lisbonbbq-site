import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Escapa vírgulas, ponto-e-vírgula, barras invertidas e quebras de linha
// conforme o RFC 5545 (secção 3.3.11).
function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  const { data: event, error } = await supabase
    .from("events")
    .select("id, slug, title, starts_at, ends_at, venue_name, venue_address")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[EventIcs] Supabase error:", error);
    return res.status(500).json({ error: "Database error" });
  }
  if (!event) {
    return res.status(404).json({ error: "Not found" });
  }

  const dtStart = toIcsDate(event.starts_at);
  // Sem ends_at definido, assume um evento de 4 horas.
  const dtEnd = toIcsDate(event.ends_at || new Date(new Date(event.starts_at).getTime() + 4 * 60 * 60 * 1000).toISOString());
  const location = [event.venue_name, event.venue_address].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LisbonBBQ//Event//PT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@lisbonbbq.pt`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    "DESCRIPTION:Fire. Long Tables. Building Community. — LisbonBBQ",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${event.slug}.ics"`);
  return res.status(200).send(lines.join("\r\n"));
}
