/**
 * fetch wrapper côté client qui désactive le cache navigateur sur les GET.
 * Évite que le navigateur serve une réponse mise en cache au lieu d'aller chercher les données fraîches.
 */
export function apiFetch(url: string, options?: RequestInit): Promise<Response> {
    const isGet = !options?.method || options.method.toUpperCase() === 'GET';
    return fetch(url, {
        ...(isGet && { cache: 'no-store' }),
        ...options,
    });
}
