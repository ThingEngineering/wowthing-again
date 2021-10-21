<script lang="ts">
    import type { IconifyIcon } from '@iconify/types'

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

<svg style="--scale: {scale};">
    {@html icon.body}
</svg>
