<script lang="ts">
    import find from 'lodash/find';
    import { getContext, tick } from 'svelte';

    // import { CollectibleState, collectibleState } from '@/stores/local-storage';
    import { browserState, type CollectibleState } from '@/shared/state/browser.svelte';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { ManualDataSetCategory } from '@/types/data/manual';
    import type { CollectibleContext } from '@/types/contexts';

    import Category from './CollectibleCategory.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';

    type Props = {
        sets: ManualDataSetCategory[][];
        slug1: string;
        slug2: string;
    };

    let { slug1, slug2, sets }: Props = $props();

    const { countsKey, thingType } = getContext('collection') as CollectibleContext;

    let collectibleState = browserState.current[
        `collectible-${countsKey}` as keyof typeof browserState.current
    ] as CollectibleState;

    let categories = $derived.by(() =>
        (find(sets, (s) => s !== null && s[0].slug === slug1) || []).filter(
            (s) => s.groups.length > 0 && (!slug2 || s.slug === slug2)
        )
    );

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'collection-v2-group', {
                columnCount: '--column-count',
                gap: 30,
                padding: '1.5rem',
            });
        } else {
            return null;
        }
    });

    // FIX: hacky, work out how to listen for resize events instead
    $effect.pre(() => {
        tick().then(() => debouncedResize?.());
    });
</script>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <div class="options-container">
        <button>
            <Checkbox name="highlight_missing" bind:value={collectibleState.highlightMissing}
                >Highlight missing</Checkbox
            >
        </button>

        <span>Show:</span>

        <button>
            <Checkbox name="show_collected" bind:value={collectibleState.showCollected}
                >Collectedss</Checkbox
            >
        </button>

        <button>
            <Checkbox name="show_uncollected" bind:value={collectibleState.showUncollected}
                >Missing</Checkbox
            >
        </button>

        <slot name="extra-options" />
    </div>

    <div class="categories" bind:this={resizeableElement}>
        {#each categories as category}
            <Category {category} {slug1} {thingType} />
        {/each}
    </div>
</div>
