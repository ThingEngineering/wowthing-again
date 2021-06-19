import tippy, { SingleTarget } from 'tippy.js'
import type {TippyProps} from '@/types'

export default function (node: SingleTarget, props: TippyProps | string): void {
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

    tippy(node, tippyProps)
}
