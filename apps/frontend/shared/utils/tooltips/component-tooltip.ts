import tippy from 'tippy.js'
import type { ComponentProps, SvelteComponent } from 'svelte'
import type { Instance, Props, SingleTarget } from 'tippy.js'

import { defaultProps } from './default-props'
import type { ComponentTooltipProps, SvelteActionResult  } from './types'


// TODO: fix typing of this mess
export function componentTooltip<TComponent extends SvelteComponent>(
    node: SingleTarget,
    componentProps: ComponentTooltipProps<TComponent>
): SvelteActionResult<Partial<ComponentProps<TComponent>>> {
    if (!componentProps) {
        return
    }

    const { component, props, testFunc, tippyProps } = componentProps

    if (testFunc?.(props) === false) {
        return
    }

    let cmp: SvelteComponent
    const elementProps = props

    const finalProps = {
        ...defaultProps,
        ...tippyProps || {},
    }

    const tp = tippy(node, {
        ...finalProps,
        allowHTML: true,
        onShow(instance: Instance<Props>) {
            cmp = new component({
                target: instance.popper.querySelector('.tippy-content'),
                props: elementProps,
            })
        },
        onHide() {
            if (cmp) {
                cmp.$destroy()
            }
        }
    })

    return {
        update(params: { props: Partial<ComponentProps<TComponent>> }) {
            Object.assign(elementProps, params.props)
            if (cmp) {
                cmp.$set(params.props)
            }
        },
        destroy() {
            tp.destroy()
            if (cmp) {
                cmp.$destroy()
            }
        }
    }
}
