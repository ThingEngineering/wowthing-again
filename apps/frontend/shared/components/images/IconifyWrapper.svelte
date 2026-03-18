<script lang="ts">
    import type { IconifyIcon } from '@iconify/types';

    import { iconLibrary } from '@/shared/icons';
    import type { ComponentIcon, Icon } from '@/types/icons';

    type Props = {
        icon: Icon;
        cls?: string;
        dropShadow?: boolean;
        onclick?: (e: Event) => void;
        scale?: string;
        tooltip?: string;
    };
    let { icon, cls, dropShadow, onclick, scale, tooltip }: Props = $props();
</script>

<style lang="scss">
    span {
        :global(svg) {
            margin-top: var(--image-margin-top, 0);
            transform: scale(var(--scale, 1));
        }
    }
    svg {
        height: 24px;
        margin-top: var(--image-margin-top, 0);
        width: 24px;
        transform: scale(var(--scale, 1));
    }
</style>

{#if 'body' in icon}
    {@const actualIcon = (icon || iconLibrary.mdiImageBrokenVariant) as IconifyIcon}
    <svg
        style:--scale={scale}
        viewBox="0 0 {actualIcon.width} {actualIcon.height}"
        aria-hidden="true"
        role="img"
        class={cls}
        class:drop-shadow-single={dropShadow}
        data-tooltip={tooltip}
        {onclick}
    >
        {@html actualIcon.body}
    </svg>
{:else}
    {@const Icon = icon as ComponentIcon}
    <span
        class={cls}
        class:drop-shadow-single={dropShadow}
        style:--scale={scale}
        data-tooltip={tooltip}
    >
        <Icon />
    </span>
{/if}
