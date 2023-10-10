import tippy from 'tippy.js'
import type { Instance, Props, SingleTarget } from 'tippy.js'

import type { TippyProps } from '@/types/tippy'


const defaultProps: TippyProps = {
    duration: [0, 0],
    ignoreAttributes: true,
    maxWidth: 600,
    placement: 'right',
}

// why is this shit not in svelte types? WHO KNOWS
interface SvelteActionResult {
    destroy?: () => void
    update?: (params: any) => void
}

export default function (node: SingleTarget, props: TippyProps | string): SvelteActionResult {
    if (props === undefined) {
        return
    }

    let tippyProps: TippyProps
    if (typeof props === 'string') {
        tippyProps = {
            ...defaultProps,
            content: props,
        }
    }
    else {
        tippyProps = {
            ...defaultProps,
            ...props,
        }
    }

    const tp = tippy(node, tippyProps)

    return {
        destroy() {
            tp.destroy()
        },
        update(params: any) {
            if (typeof params === 'string') {
                tippyProps.content = params
            }
            else {
                tippyProps = {
                    ...tippyProps,
                    ...params,
                }
            }
            tp.setProps(tippyProps)
        },
    }
}

export interface TippyComponentProps {
    component: any
    props: any
    testFunc?: (props: any) => boolean
    tippyProps?: TippyProps
}

// TODO: fix typing of this mess
export function tippyComponent(
    node: SingleTarget,
    componentProps: TippyComponentProps
): SvelteActionResult {
    if (!componentProps) {
        return
    }

    const { component, props, testFunc, tippyProps } = componentProps

    if (testFunc?.(props) === false) {
        return
    }

    let cmp: any
    const elementProps: any = props

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
        update(params: {props: any}) {
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
