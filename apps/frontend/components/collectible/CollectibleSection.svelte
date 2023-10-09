<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate, getContext } from 'svelte'

    import { collectibleState } from '@/stores/local-storage'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import type { ManualDataSetCategory } from '@/types/data/manual'
    import type { CollectibleContext } from '@/types/contexts'

    import Category from './CollectibleCategory.svelte'
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'

    export let slug1: string
    export let slug2: string
    export let sets: ManualDataSetCategory[][]

    const { countsKey, thingType } = getContext('collection') as CollectibleContext

    let categories: ManualDataSetCategory[]
    $: {
        categories = (find(sets, (s) => s !== null && s[0].slug === slug1) || [])
            .filter((s) =>
                s.groups.length > 0 &&
                (!slug2 || s.slug === slug2)
            )
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '1.5rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }

    afterUpdate(() => debouncedResize?.())
</script>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <div class="options-container">
        <button>
            <Checkbox
                name="highlight_missing"
                bind:value={$collectibleState.highlightMissing[countsKey]}
            >Highlight missing</Checkbox>
        </button>

        <span>Show:</span>

        <button>
            <Checkbox
                name="show_collected"
                bind:value={$collectibleState.showCollected[countsKey]}
            >Collected</Checkbox>
        </button>

        <button>
            <Checkbox
                name="show_uncollected"
                bind:value={$collectibleState.showUncollected[countsKey]}
            >Missing</Checkbox>
        </button>
    </div>

    <div class="categories" bind:this={resizeableElement}>
        {#each categories as category}
            <Category
                {category}
                {slug1}
                {thingType}
            />
        {/each}
    </div>
</div>
