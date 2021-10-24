export default async function fetchJson(
    url: string,
): Promise<string | null> {
    const request = new Request(url, {
        credentials: "include",
        mode: "cors",
    })

    return fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.text() ?? null
            } else {
                console.log(`fetch failed: ${response.status} ${response.statusText}`)
                return null
            }
        })
        .catch((err) => {
            console.error(`fetch error: ${err}`)
            return null
        })
}
