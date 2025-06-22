import { mount, unmount } from 'svelte';
import tippy from 'tippy.js';
import type { Component, ComponentProps } from 'svelte';
import type { Instance, Props, SingleTarget } from 'tippy.js';

import { defaultProps } from './default-props';
import type { ComponentTooltipProps, SvelteActionResult } from './types';

// TODO: fix typing of this mess
export function componentTooltip<TComponent extends Component<any, any, any>>(
    node: SingleTarget,
    componentProps: ComponentTooltipProps<TComponent>
): SvelteActionResult<{ props: Partial<ComponentProps<TComponent>> }> {
    if (!componentProps) {
        return;
    }

    const { component, testFunc, tippyProps } = componentProps;

    let cmp: Record<string, unknown> = $state.raw();
    // const elementProps = $state(props);

    const finalProps = {
        ...defaultProps,
        ...(tippyProps || {}),
    };

    $effect(() => {
        const props = componentProps.propsFunc?.() || componentProps.props;
        if (testFunc?.(props) === false) {
            return;
        }

        const tp = tippy(node, {
            ...finalProps,
            allowHTML: true,
            onShow(instance: Instance<Props>) {
                cmp = mount(component, {
                    target: instance.popper.querySelector('.tippy-content'),
                    props,
                });
            },
            onHide() {
                unmount(cmp);
                cmp = null;
            },
        });

        return () => {
            if (cmp) {
                // console.log('destroy unmount');
                // unmount(cmp);
                cmp = null;
            }
            tp.destroy();
        };
    });
    //meow
    // return {
    //     update(params: { props: Partial<ComponentProps<TComponent>> }) {
    //         Object.assign(elementProps, params.props);
    //         // if (cmp) {
    //         //     cmp.$set(params.props);
    //         // }
    //     },
    //     destroy() {
    //         if (cmp) {
    //             console.log('unmount', cmp);
    //             unmount(cmp);
    //             cmp = {};
    //         }
    //         tp.destroy();
    //     },
    // };
}
