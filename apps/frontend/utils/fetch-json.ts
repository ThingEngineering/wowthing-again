export default async function fetchJson(
    url: string,
): Promise<[string | null, boolean]> {
    const request = new Request(url, {
        credentials: 'include',
        mode: 'cors',
    })

    const response = await fetch(request)
    if (!response.ok) {
        throw response.statusText
    }
    return [await response.text() ?? null, response.redirected]
}
