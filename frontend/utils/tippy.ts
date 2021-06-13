import tippy, { Props, SingleTarget } from 'tippy.js'

export default function(node: SingleTarget, props: Partial<Props>): void {
    if (props?.content !== undefined) {
        props = {
            //placement: 'right',
            ...props
        }
        tippy(node, props)
    }
}
