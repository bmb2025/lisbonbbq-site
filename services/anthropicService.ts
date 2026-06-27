import { AIRecommendation } from "../types";

// All AI calls go through the Vercel API route — API key stays server-side only.

export const getBBQRecommendation = async (
  guests: number,
  vibe: string,
  style: string
): Promise<AIRecommendation> => {
  try {
    const response = await fetch("/api/ai-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "bbq-recommendation", guests, vibe, style }),
    });
    if (!response.ok) throw new Error("AI unavailable");
    return await response.json();
  } catch {
    return {
      coalBags: 2,
      drinkPacks: 10,
      meatKg: 15,
      platesPacks: 5,
      reasoning: "Estimativa padrão.",
    };
  }
};

export const generateArticleDraft = async (
  title: string,
  category: string
): Promise<string> => {
  try {
    const response = await fetch("/api/ai-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "article-draft", title, category }),
    });
    if (!response.ok) throw new Error("AI unavailable");
    const data = await response.json();
    return data.content || "Erro ao gerar conteúdo.";
  } catch {
    return "Falha na ligação ao serviço de IA.";
  }
};

// Image generation not supported via Claude — returns null gracefully.
export const generateBrandLogo = async (): Promise<string | null> => null;
