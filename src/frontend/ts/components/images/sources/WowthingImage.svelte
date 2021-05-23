<script lang="ts">
    import tippy from '../../../utils/tippy'

    export let name: string
    export let ext: string = "png"
    export let size: number
    export let tooltip: object | string = undefined
    export let border: number = 0
    export let cls: string = undefined

    const actualSize = size + (border * 2)
    const tooltipProps = typeof(tooltip) === 'string' ? { content: tooltip } : tooltip
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
