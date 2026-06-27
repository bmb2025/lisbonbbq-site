import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .in("source", ["corporate", "corp"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Leads-Corp] Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  // Flatten: merge row metadata into the lead data object
  const leads = (data || []).map((row: any) => ({
    ...row.data,
    id: row.id,
    _createdAt: row.created_at,
  }));

  return res.json(leads);
}
