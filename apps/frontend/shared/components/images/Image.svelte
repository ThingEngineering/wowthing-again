<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';

    import Tooltip from '@/shared/components/parsed-text/Tooltip.svelte';
    import type { TippyProps } from '@/shared/utils/tooltips/types';

    export let src: string;
    export let alt: string;
    export let border = 0;
    export let height = 0;
    export let size = 0;
    export let width = 0;
    export let cls: string = undefined;
    export let lazy = true;
    export let tooltip: TippyProps | string = undefined;

    let actualHeight: number;
    let actualWidth: number;
    $: {
        actualHeight = (height || size) + border * 2;
        actualWidth = (width || size) + border * 2;
    }

    $: content =
        tooltip === undefined
            ? undefined
            : typeof tooltip === 'string'
              ? tooltip
              : (tooltip.content as string);
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
