// Proxy para a API oficial dos CTT (cttcodigopostal.pt) — corre no servidor para
// a chave nunca ficar exposta no bundle do browser. Falha sempre em silêncio
// (200 com locality:null): a localidade é só um extra de UX, nunca deve
// bloquear o preenchimento do formulário.
export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cp4 = String(req.query.cp4 || "");
  const cp3 = String(req.query.cp3 || "");
  if (!/^\d{4}$/.test(cp4) || !/^\d{3}$/.test(cp3)) {
    return res.status(200).json({ locality: null });
  }

  const apiKey = process.env.CTT_POSTAL_API_KEY;
  if (!apiKey) {
    console.error("[postal-lookup] CTT_POSTAL_API_KEY não configurada");
    return res.status(200).json({ locality: null });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://www.cttcodigopostal.pt/api/v1/${apiKey}/${cp4}-${cp3}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return res.status(200).json({ locality: null });

    const data = await response.json();
    const entry = Array.isArray(data) ? data[0] : null;
    if (!entry?.localidade) return res.status(200).json({ locality: null });

    const locality = entry.localidade === entry.concelho
      ? entry.localidade
      : `${entry.localidade}, ${entry.concelho}`;
    return res.status(200).json({ locality });
  } catch (err) {
    console.error("[postal-lookup] erro:", err);
    return res.status(200).json({ locality: null });
  }
}
