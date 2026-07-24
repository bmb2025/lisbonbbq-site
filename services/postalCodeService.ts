// Passa pelo nosso /api/postal-lookup (proxy para a API dos CTT) em vez de
// chamar um serviço externo diretamente do browser — mantém a chave de API
// fora do bundle público. Falha sempre em silêncio: a localidade é só um
// extra de UX, nunca deve bloquear o preenchimento do formulário.
export async function lookupPostalCode(cp4: string, cp3: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`/api/postal-lookup?cp4=${cp4}&cp3=${cp3}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;

    const data = await response.json();
    return data?.locality || null;
  } catch {
    return null;
  }
}
