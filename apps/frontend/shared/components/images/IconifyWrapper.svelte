<script lang="ts">
    import type { Icon } from '@/types/icons';

    type Props = {
        icon: Icon;
        cls?: string;
        dropShadow?: boolean;
        onclick?: (e: Event) => void;
        scale?: string;
        tooltip?: string;
    };
    let { icon, cls, dropShadow, onclick, scale, tooltip }: Props = $props();

    let IconComponent = $derived(icon);
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

<span
    class={cls}
    class:drop-shadow-single={dropShadow}
    style:--scale={scale}
    data-tooltip={tooltip}
>
    <IconComponent {onclick} />
</span>
