export default async function fetchJson<T>(
    url: string,
): Promise<[T, boolean]> {
    const request = new Request(url, {
        credentials: 'include',
        mode: 'cors',
    })

    const response = await fetch(request)
    if (!response.ok) {
        console.error(response)
        throw response.statusText
    }
    return [await response.json() ?? null, response.redirected]
}
