import tippy from 'tippy.js'

export default function(node, props) {
    if (props !== undefined && props.content !== undefined) {
        props = {
            //placement: 'right',
            ...props
        }
        node._sigh = tippy(node, props)
    }
}
