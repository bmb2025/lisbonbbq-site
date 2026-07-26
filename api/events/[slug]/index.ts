import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[Events] Supabase error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  if (!event) {
    return res.status(404).json({ error: "Not found" });
  }

  const { data: menuItems, error: menuError } = await supabase
    .from("event_menu_items")
    .select("*")
    .eq("event_id", event.id)
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true });

  if (menuError) {
    console.error("[Events] Supabase menu error:", menuError);
    return res.status(500).json({ error: "Database error" });
  }

  return res.json({ event, menuItems: menuItems || [] });
}
