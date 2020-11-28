<script lang="ts">
    import tippy from '../../../utils/tippy'

    export let size: string
    export let name: string
    export let tooltip: object = undefined
    export let border: string = "0"

    const actualSize = parseInt(size) + (parseInt(border) * 2)
    const tooltipProps = {
        content: tooltip,
    }
</script>

<img src="https://img.wowthing.org/{size}/{name}.png" width="{actualSize}" height="{actualSize}" use:tippy={tooltipProps}>
