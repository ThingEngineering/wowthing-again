import tippy, { Props, SingleTarget } from 'tippy.js'

export default function(node: SingleTarget, props: Partial<Props>) {
    if (props?.content !== undefined) {
        props = {
            //placement: 'right',
            ...props
        }
        const sigh = tippy(node, props)
    }
}
