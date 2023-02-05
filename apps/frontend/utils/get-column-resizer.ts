import debounce from 'lodash/debounce'


type ColumnResizerOptions = {
    columnCount: string
    gap: number
    padding: string
}

export function getColumnResizer(
    widthElement: HTMLElement,
    resizeableElement: HTMLElement,
    tagName: string,
    options?: Partial<ColumnResizerOptions>
) {
    let childWidth: number

    const columnCount = options?.columnCount || 'column-count'
    const gap = options?.gap || 20

    return debounce(() => {
        const children = resizeableElement.getElementsByClassName(tagName)
        if (children.length === 0) {
            resizeableElement.style.width = '100%'
            return
        }

        childWidth = children[0].getBoundingClientRect().width

        const totalWidth = widthElement.getBoundingClientRect().width
        const fitCount = Math.floor(totalWidth / childWidth)

        let finalWidth: string
        if (fitCount > 1) {
            for (let i = fitCount; i > 1; i--) {
                const newWidth = (i * childWidth) + ((i - 1) * (gap))
                if (newWidth <= totalWidth) {
                    finalWidth = `${newWidth}px`
                    resizeableElement.style.setProperty(columnCount, i.toString())
                    break
                }
            }
        }

        if (!finalWidth) {
            resizeableElement.style.setProperty(columnCount, '1')
            finalWidth = `${childWidth}px`
        }

        resizeableElement.style.width = options?.padding ? `calc(${finalWidth} + ${options.padding})` : finalWidth
    }, 100, { maxWait: 250 })
}
