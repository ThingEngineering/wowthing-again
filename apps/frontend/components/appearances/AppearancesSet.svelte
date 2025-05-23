<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { settingsStore } from '@/shared/stores/settings';
    import { lazyStore, userStore } from '@/stores';
    import { appearanceState } from '@/stores/local-storage';
    import getPercentClass from '@/utils/get-percent-class';
    import type { AppearanceDataSet } from '@/types/data/appearance';

    import Count from '@/components/collectible/CollectibleCount.svelte';
    import Item from './AppearancesItem.svelte';

    export let set: AppearanceDataSet;
    export let slug: string;

    let element: HTMLElement;
    let intersected: boolean;

    $: counts = $lazyStore.appearances.stats[slug];
    $: masochist = $settingsStore.transmog.completionistMode;
</script>

{#if counts.total > 0}
    <div class="collection-v2-group">
        <h4 class="drop-shadow {getPercentClass(counts.percent)}">
            {set.name}
            <Count {counts} />
        </h4>

        <div bind:this={element} class="collection-objects">
            <IntersectionObserver bind:intersecting={intersected} once {element}>
                {#if intersected}
                    {#each set.appearances as appearance}
                        {@const modifiedAppearances = appearance.modifiedAppearances.slice(
                            0,
                            masochist ? 9999 : 1,
                        )}
                        {#each modifiedAppearances as modifiedAppearance}
                            {@const has = masochist
                                ? $userStore.hasSourceV2
                                      .get(modifiedAppearance.modifier)
                                      .has(modifiedAppearance.itemId)
                                : $userStore.hasAppearance.has(appearance.appearanceId)}
                            {@const show =
                                ((has && $appearanceState.showCollected) ||
                                    (!has && $appearanceState.showUncollected)) &&
                                $appearanceState[`showQuality${modifiedAppearance.quality}`] ===
                                    true}
                            {#if show}
                                <Item {has} {modifiedAppearance} />
                            {/if}
                        {/each}
                    {/each}
                {/if}
            </IntersectionObserver>
        </div>
    </div>
{/if}
