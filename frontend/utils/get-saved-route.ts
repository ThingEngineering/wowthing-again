import { replace } from 'svelte-spa-router'


export default function getSavedRoute(route: string, slug1?: string, slug2?: string): void {
    const key = `route-${route}`
    if (slug1 === null) {
        const saved = localStorage.getItem(key)
        const subSidebar = document.getElementById('sub-sidebar')
        if (subSidebar !== null) {
            if (saved !== null) {
                const urlPath = `/${route}/${saved}`
                const savedElement = subSidebar.querySelector(`li a[href="#${urlPath}"]`)
                if (savedElement) {
                    replace(urlPath)
                    return
                }
            }

            const first = subSidebar.querySelector('li a')
            replace(first.getAttribute('href').replace('#', ''))
        }
    }
    else {
        localStorage.setItem(key, slug2 ? `${slug1}/${slug2}` : slug1)
    }
}
