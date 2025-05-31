<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate } from 'svelte'

    import { lazyStore, manualStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import getPercentClass from '@/utils/get-percent-class'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataCustomizationCategory } from '@/types/data/manual'

    import Options from './Options.svelte'
    import Thing from './Thing.svelte'

    export let params: MultiSlugParams

    let category: ManualDataCustomizationCategory
    $: {
        const categories = find($manualStore.customizationCategories, (c) => c !== null && c[0].slug === params.slug1)
        if (!categories) { break $ }

        category = find(categories, (c) => c !== null && c.slug === params.slug2)
        if (!category) { break $ }
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'table-striped',
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

<style lang="scss">
    .idk {
        columns: var(--column-count, 1);
    }
    table {
        --image-margin-top: -4px;
        --scale: 0.9;

        break-inside: avoid;
        overflow: hidden; /* Firefox fix */
        max-width: 35.5rem;
        min-width: 35.5rem;
    }
    table + table {
        margin-top: 1rem;
    }
    .group-name {
        padding-left: 0.4rem;
        padding-right: 0.4rem;
    }
    .group-stats {
        font-size: 90%;
        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#if category}
    <div class="resizer-view" bind:this={containerElement}>
        <Options />

        <div class="idk" bind:this={resizeableElement}>
            {#each category.groups as group}
                {@const groupStats = $lazyStore.customizations[`${params.slug1}--${params.slug2}--${group.name}`]}
                {@const color = getPercentClass(groupStats.percent)}
                {#if ($collectibleState.showCollected["customizations"] && groupStats.have > 0)
                    || ($collectibleState.showUncollected["customizations"] && groupStats.have < groupStats.total)}
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <td colspan="3" class="group-name {color}">
                                    <div class="flex-wrapper">
                                        <span>
                                            {group.name}
                                        </span>
                                        <span class="group-stats">
                                            {groupStats.have}
                                            /
                                            {groupStats.total}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {#each group.things as thing}
                                <Thing {thing} />
                            {/each}
                        </tbody>
                    </table>
                {/if}
            {/each}
        </div>
    </div>
{/if}
