<script lang="ts">
    import { iconScale } from '@/shared/icons/scale';
    import type { Icon } from '@/types/icons';

    type Props = {
        icon: Icon;
        cls?: string;
        dropShadow?: boolean;
        scale?: string;
        tooltip?: string;
        onclick?: (e: Event) => void;
    };
    let { icon, cls, dropShadow, onclick, scale, tooltip }: Props = $props();

    let IconComponent = $derived(icon);

    // we can't get the FILENAME symbol from Svelte internals, boo
    let filename = $derived.by(() => {
        const symbols = Object.getOwnPropertySymbols(icon);
        // @ts-expect-error fixing the typing for this is awful
        return icon[symbols.find((sym) => sym.description === 'filename')];
    });
    let derivedScale = $derived(scale || iconScale[filename]);
</script>

<style lang="scss">
    span {
        :global(svg) {
            margin-top: var(--image-margin-top, 0);
            transform: scale(var(--scale, 1));
        }
    }
</style>

<span
    class={cls}
    class:drop-shadow-single={dropShadow}
    style:--scale={derivedScale}
    data-tooltip={tooltip}
>
    <IconComponent {onclick} />
</span>
