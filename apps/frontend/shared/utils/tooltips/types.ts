import type { Props } from 'tippy.js'

export type TippyProps = Partial<Props>

export interface ComponentTooltipProps {
    component: any
    props: any
    testFunc?: (props: any) => boolean
    tippyProps?: TippyProps
}

// why is this shit not in svelte types? WHO KNOWS
export interface SvelteActionResult {
    destroy?: () => void
    update?: (params: any) => void
}
