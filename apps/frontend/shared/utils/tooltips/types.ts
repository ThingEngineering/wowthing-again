import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte'
import type { Props } from 'tippy.js'


export type TippyProps = Partial<Props>

export interface ComponentTooltipProps<TComponent extends SvelteComponent> {
    component: ComponentType<TComponent>
    props: ComponentProps<TComponent>
    testFunc?: (props: ComponentProps<TComponent>) => boolean
    tippyProps?: TippyProps
}

// why is this shit not in svelte types? WHO KNOWS
export interface SvelteActionResult {
    destroy?: () => void
    update?: (params: any) => void
}
