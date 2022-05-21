import { replace } from 'svelte-spa-router'


export default function getSavedRoute(route: string, slug1?: string, slug2?: string): void {
    const key = `route-${route}`
    if (slug1 === null) {
        const saved = localStorage.getItem(key)
        const subSidebar = document.getElementById('sub-sidebar')
        if (subSidebar !== null) {
            if (saved !== null && saved !== 'undefined') {
                replace(`/${route}/${saved}`)
                return
            }

            const first = subSidebar.querySelector('a')
            replace(first.getAttribute('href').replace('#', ''))
        }
    }
    else {
        localStorage.setItem(key, slug2 ? `${slug1}/${slug2}` : slug1)
    }
}
