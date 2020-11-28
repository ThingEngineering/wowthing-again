<script lang="ts">
    import tippy from '../../../utils/tippy'

    export let size
    export let name: string
    export let tooltip: object = undefined

    const tooltipProps = {
        content: tooltip,
    }
</script>

<img src="https://img.wowthing.org/{size}/{name}.png" width="{size}" height="{size}" use:tippy={tooltipProps}>
