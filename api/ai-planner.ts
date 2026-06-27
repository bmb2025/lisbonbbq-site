import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, guests, vibe, style, title, category } = req.body;

  try {
    if (type === "bbq-recommendation") {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `Plan a ${style} BBQ for ${guests} guests with vibe "${vibe}". Respond ONLY with a valid JSON object (no markdown, no explanation) with keys: coalBags (integer), drinkPacks (integer), meatKg (integer), platesPacks (integer), reasoning (short string in Portuguese).`,
          },
        ],
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return res.json(JSON.parse(match[0]));
      }
      return res.json({
        coalBags: 2,
        drinkPacks: 10,
        meatKg: 15,
        platesPacks: 5,
        reasoning: "Estimativa padrão.",
      });
    }

    if (type === "article-draft") {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: `Escreve um artigo de blog de alta qualidade para "Lisbon Barbecue & Churrasco".
Título: "${title}"
Categoria: "${category}"
Formato: Markdown.
Idioma: Português (Portugal).
Tom: serviço de concierge premium, apaixonado por churrasco.
Inclui introdução, corpo com dicas práticas, e conclusão com call-to-action.`,
          },
        ],
      });

      const content =
        message.content[0].type === "text"
          ? message.content[0].text
          : "Erro ao gerar conteúdo.";
      return res.json({ content });
    }

    return res.status(400).json({ error: "Unknown type" });
  } catch (error) {
    console.error("[AI Planner] Error:", error);
    return res.status(500).json({ error: "AI service unavailable" });
  }
}
