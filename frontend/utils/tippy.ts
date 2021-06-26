import tippy, { SingleTarget } from 'tippy.js'

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
