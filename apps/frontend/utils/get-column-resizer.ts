import debounce from 'lodash/debounce';

type ColumnResizerOptions = {
    columnCount: string;
    gap: number;
    minColumns: number;
    padding: string;
};

export function getColumnResizer(
    widthElement: HTMLElement,
    resizeableElement: HTMLElement,
    tagName: string,
    options?: Partial<ColumnResizerOptions>,
) {
    let childWidth: number;

    const columnCount = options?.columnCount || 'column-count';
    const gap = options?.gap || 20;
    const minColumns = options?.minColumns || 0;

    return debounce(
        () => {
            const children = resizeableElement.getElementsByClassName(tagName);
            if (children.length === 0) {
                resizeableElement.style.width = '100%';
                return;
            }

            childWidth = children[0].getBoundingClientRect().width;

            const totalWidth = widthElement.getBoundingClientRect().width;
            const fitCount = Math.max(minColumns, Math.floor(totalWidth / childWidth));

            let finalWidth: string;
            if (fitCount > 1) {
                for (let i = fitCount; i > 1; i--) {
                    const newWidth = i * childWidth + (i - 1) * gap;
                    if (newWidth <= totalWidth || i >= minColumns) {
                        finalWidth = `${newWidth}px`;
                        resizeableElement.style.setProperty(columnCount, i.toString());
                        break;
                    }
                }
            }

            if (!finalWidth) {
                resizeableElement.style.setProperty(columnCount, '1');
                finalWidth = `${childWidth}px`;
            }

            // console.log({ childWidth, finalWidth, fitCount, totalWidth })

            resizeableElement.style.width = options?.padding
                ? `calc(${finalWidth} + (${options.padding} * 2))`
                : finalWidth;
        },
        100,
        { maxWait: 250 },
    );
}
