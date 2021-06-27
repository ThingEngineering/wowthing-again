import tippy, { SingleTarget } from 'tippy.js'
import type {Instance, Props} from 'tippy.js'

import type {TippyProps} from '@/types'

export default function (node: SingleTarget, props: TippyProps | string): any {
    if (props === undefined) {
        return
    }

    let tippyProps: TippyProps
    if (typeof props === 'string') {
        tippyProps = {
            content: props,
        }
    }
    else {
        tippyProps = {
            //placement: 'right',
            ...props,
        }
    }

    const tp = tippy(node, tippyProps)

    return {
        destroy() {
            tp.destroy()
        }
    }
}

// TODO: fix typing of this mess
export function tippyComponent(node: SingleTarget, {component, props}: TippyComponentProps): any {
    let cmp: any

    const tp = tippy(node, {
        allowHTML: true,
        onShow(instance: Instance<Props>) {
            cmp = new component({
                target: instance.popper.querySelector('.tippy-content'),
                props
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

interface TippyComponentProps {
    component: any
    props: any
}
