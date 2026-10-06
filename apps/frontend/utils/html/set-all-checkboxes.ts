export function setAllCheckboxes(element: HTMLElement, parentContainer: string, state: boolean) {
    const parent = element.closest(parentContainer);
    if (!parent) {
        return;
    }

    const buttonsToClick = Array.from(
        parent.querySelectorAll(`input:${state ? 'not(:checked)' : 'checked'}`)
    ) as HTMLInputElement[];
    for (const button of buttonsToClick) {
        button.click();
    }
}
