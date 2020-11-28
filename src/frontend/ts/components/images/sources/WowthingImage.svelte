<script lang="ts">
    import tippy from '../../../utils/tippy'

    export let size
    export let name: string
    export let tooltip: object = undefined
    export let border: number = 0

    const actualSize = size + (border * 2)
    const tooltipProps = {
        content: tooltip,
    }
</script>

<img src="https://img.wowthing.org/{size}/{name}.png" width="{actualSize}" height="{actualSize}" use:tippy={tooltipProps}>
