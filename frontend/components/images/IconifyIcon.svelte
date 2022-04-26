<script lang="ts">
    import type { IconifyIcon } from '@iconify/types'

    export let dropShadow = false
    export let extraClass: string = undefined
    export let icon: IconifyIcon
    export let scale = '1'
</script>

<style lang="scss">
    svg {
        height: 24px;
        width: 24px;
        transform: scale(var(--scale));
    }
</style>

<svg
    style="--scale: {scale};"
    viewBox="0 0 {icon.width} {icon.height}"
    aria-hidden="true"
    role="img"
    class="{extraClass}"
    class:drop-shadow={dropShadow}
>
    {@html icon.body}
</svg>
