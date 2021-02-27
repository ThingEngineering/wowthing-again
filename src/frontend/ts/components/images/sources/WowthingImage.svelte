<script lang="ts">
    import tippy from '../../../utils/tippy'

    export let name: string
    export let ext: string = "png"
    export let size: string
    export let tooltip: object = undefined
    export let border: string = "0"
    export let cls: string = undefined

    const actualSize = parseInt(size) + (parseInt(border) * 2)
    const tooltipProps = {
        content: tooltip,
    }
</script>

<img
    src="https://img.wowthing.org/{size}/{name}.{ext}"
    class="{cls}"
    width="{actualSize}"
    height="{actualSize}"
    alt="{name}"
    loading="lazy"
    use:tippy={tooltipProps}
>
