<svelte:options immutable={true} />

<script lang="ts">
    import { iconLibrary } from '@/shared/icons';

    import type { IconifyIcon } from '@iconify/types';

    export let dropShadow = false;
    export let extraClass: string = undefined;
    export let icon: IconifyIcon;
    export let scale: string = null;
    export let tooltip: string = undefined;

    $: icon ||= iconLibrary.mdiImageBrokenVariant;
</script>

<style lang="scss">
    svg {
        height: 24px;
        margin-top: var(--image-margin-top, 0);
        width: 24px;
        transform: scale(var(--scale, 1));
    }
</style>

<svg
    style:--scale={scale}
    viewBox="0 0 {icon.width} {icon.height}"
    aria-hidden="true"
    role="img"
    class={extraClass}
    class:drop-shadow-single={dropShadow}
    data-tooltip={tooltip}
    on:click
>
    {@html icon.body}
</svg>
