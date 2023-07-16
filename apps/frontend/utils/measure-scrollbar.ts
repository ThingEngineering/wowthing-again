export function measureScrollbar() {
    const box = document.createElement('div')
    box.style.overflow = 'scroll'
    document.body.appendChild(box)
    const scrollbarWidth = box.offsetWidth - box.clientWidth;
    document.body.removeChild(box)
    return scrollbarWidth
}
