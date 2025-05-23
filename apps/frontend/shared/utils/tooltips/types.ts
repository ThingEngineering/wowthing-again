import type { Component, ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import type { Props } from 'tippy.js';

export type TippyProps = Partial<Props>;

export interface ComponentTooltipProps<TComponent extends Component> {
    component: TComponent;
    props: ComponentProps<TComponent>;
    testFunc?: (props: ComponentProps<TComponent>) => boolean;
    tippyProps?: TippyProps;
}

// why is this shit not in svelte types? WHO KNOWS
export interface SvelteActionResult<TParams> {
    destroy?: () => void;
    update?: (params: TParams) => void;
}
