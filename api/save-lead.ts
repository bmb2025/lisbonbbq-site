import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const leadData = req.body;
  const email =
    leadData?.client?.email || leadData?.email || null;
  const source = leadData?.source || "direct";

  console.log(`[Lead] New submission — email: ${email}, source: ${source}`);

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

    console.log("[Lead] Saved to Supabase successfully");
    return res.json({ success: true, message: "Lead recebida e processada." });
  } catch (error) {
    console.error("[Lead] Unexpected error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
