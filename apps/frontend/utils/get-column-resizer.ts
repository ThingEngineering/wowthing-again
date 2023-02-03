import debounce from 'lodash/debounce'


export function getColumnResizer(
    widthElement: HTMLElement,
    resizeableElement: HTMLElement,
    tagName: string
) {
    let childWidth: number

    return debounce(() => {
        if (!childWidth) {
            childWidth = resizeableElement.getElementsByClassName(tagName)[0].clientWidth
        }

        const totalWidth = widthElement.clientWidth
        const fitCount = Math.floor(totalWidth / childWidth)

        let set = false
        if (fitCount > 1) {
            for (let i = fitCount; i > 1; i--) {
                const newWidth = (i * childWidth) + ((i - 1) * 20)
                if (newWidth <= totalWidth) {
                    resizeableElement.style.width = `${newWidth}px`
                    resizeableElement.style.columnCount = i.toString()
                    set = true
                    break
                }
            }
        }

        if (!set) {
            resizeableElement.style.columnCount = '1'
            resizeableElement.style.width = `${childWidth}px`
        }
    }, 100, { maxWait: 100 })
}
