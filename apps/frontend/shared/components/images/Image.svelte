<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { ImageProps } from '@/types/props';
    import type { MakeOptional } from '@/types/utility';

    import Tooltip from '@/shared/components/parsed-text/Tooltip.svelte';

    type Props = MakeOptional<ImageProps, 'size'> & {
        alt: string;
        src: string;
        height?: number;
        width?: number;
        lazy?: boolean;
    };
    let { alt, src, border = 0, cls, height, lazy = true, size, tooltip, width }: Props = $props();

    let actualHeight = $derived((height || size) + border * 2);
    let actualWidth = $derived((width || size) + border * 2);

    let content = $derived(
        tooltip === undefined
            ? undefined
            : typeof tooltip === 'string'
              ? tooltip
              : (tooltip.content as string)
    );
</script>

<style lang="scss">
    img {
        border-color: var(--image-border-color, var(--border-color));
        border-radius: var(--image-border-radius, var(--border-radius));
        border-style: solid;
        border-width: var(--image-border-width, 0);
        margin-top: var(--image-margin-top, 0);
    }
</style>

<img
    {src}
    class={cls}
    width={actualWidth}
    height={actualHeight}
    {alt}
    loading={lazy ? 'lazy' : null}
    use:componentTooltip={{
        component: Tooltip,
        props: {
            content,
        },
        testFunc: (options) => options.content !== undefined,
    }}
/>
