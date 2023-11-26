import tippy from 'tippy.js'
import type { SingleTarget } from 'tippy.js'

import { defaultProps } from './default-props'
import type { SvelteActionResult, TippyProps } from './types'


export function basicTooltip(
    node: SingleTarget,
    props: string | TippyProps
): SvelteActionResult<string | TippyProps> {
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
        update(params: string | TippyProps) {
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
