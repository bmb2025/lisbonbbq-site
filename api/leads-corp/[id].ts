import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("[Leads-Corp] Delete error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json({ success: true, message: "Lead removida com sucesso." });
}
