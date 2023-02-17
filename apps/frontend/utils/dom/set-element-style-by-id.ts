

export function setElementStyleById(elementId: string, styleName: string, styleValue: string): void {
    const element = document.getElementById(elementId)
    if (element) {
        element .style.setProperty(styleName, styleValue)
    }
}
