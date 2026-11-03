<script lang="ts">
    import find from 'lodash/find';

    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import getPercentClass from '@/utils/get-percent-class';
    import type { MultiSlugParams } from '@/types';

    import Options from './Options.svelte';
    import Thing from './Thing.svelte';

    let { params }: { params: MultiSlugParams } = $props();

    let category = $derived.by(() => {
        const categories = find(
            wowthingData.manual.customizationCategories,
            (c) => c !== null && c[0].slug === params.slug1
        );
        return find(categories || [], (c) => c !== null && c.slug === params.slug2);
    });

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'table-striped', {
                columnCount: '--column-count',
                gap: 30,
                padding: '1.5rem',
            });
        } else {
            return null;
        }
    });
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
            {#each category.groups as group (group)}
                {@const groupStats =
                    lazyState.customizations[`${params.slug1}--${params.slug2}--${group.name}`]}
                {@const color = getPercentClass(groupStats.percent)}
                {#if (browserState.current['collectible-customizations'].showCollected && groupStats.have > 0) || (browserState.current['collectible-customizations'].showUncollected && groupStats.have < groupStats.total)}
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
                            {#each group.things as thing (thing)}
                                <Thing {thing} />
                            {/each}
                        </tbody>
                    </table>
                {/if}
            {/each}
        </div>
    </div>
{/if}
