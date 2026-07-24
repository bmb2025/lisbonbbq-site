// json.geoapi.pt é uma API pública gratuita e sem chave, mas com limite de
// pedidos agressivo (chega a devolver 429 em poucos pedidos seguidos). Por
// isso falha sempre em silêncio — a localidade é só um extra de UX, nunca
// deve bloquear o preenchimento do formulário.
export async function lookupPostalCode(cp4: string, cp3: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://json.geoapi.pt/cp/${cp4}-${cp3}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.Localidade) return null;
    return data.Localidade === data.Concelho ? data.Localidade : `${data.Localidade}, ${data.Concelho}`;
  } catch {
    return null;
  }
}
