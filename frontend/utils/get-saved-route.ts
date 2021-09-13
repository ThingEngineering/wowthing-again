import { replace } from 'svelte-spa-router'


export default function getSavedRoute(route: string, slug1?: string, slug2?: string): void {
    const key = `route-${route}`
    if (slug1 === null) {
        const saved = localStorage.getItem(key)
        if (saved !== null) {
            replace(`/${route}/${saved}`)
        }
        else {
            const subSidebar = document.getElementById('sub-sidebar')
            if (subSidebar !== null) {
                const first = subSidebar.querySelector('li a')
                replace(first.getAttribute('href').replace('#', ''))
            }
        }
    }
    else {
        localStorage.setItem(key, slug2 ? `${slug1}/${slug2}` : slug1)
    }
}
