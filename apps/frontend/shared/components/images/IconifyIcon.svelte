<script lang="ts">
    import { iconLibrary } from '@/shared/icons';

    import type { IconifyIcon } from '@iconify/types';

    type Props = {
        icon: IconifyIcon;
        dropShadow?: boolean;
        extraClass?: string;
        scale?: string;
        tooltip?: string;
    };
    let { icon, dropShadow, extraClass, scale, tooltip }: Props = $props();

    let actualIcon = $derived((icon ||= iconLibrary.mdiImageBrokenVariant));
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
    viewBox="0 0 {actualIcon.width} {actualIcon.height}"
    aria-hidden="true"
    role="img"
    class={extraClass}
    class:drop-shadow-single={dropShadow}
    data-tooltip={tooltip}
    on:click
>
    {@html actualIcon.body}
</svg>
