<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { appearanceState } from '@/stores/local-storage';
    import { lazyState } from '@/user-home/state/lazy';
    import { userState } from '@/user-home/state/user';
    import getPercentClass from '@/utils/get-percent-class';
    import type { AppearanceDataSet } from '@/types/data/appearance';

    import Count from '@/components/collectible/CollectibleCount.svelte';
    import Item from './AppearancesItem.svelte';

    let { set, slug }: { set: AppearanceDataSet; slug: string } = $props();

    let counts = $derived(lazyState.appearances.stats[slug]);
    let masochist = $derived(settingsState.value.transmog.completionistMode);

    let element: HTMLElement = $state(null);
    let intersected: boolean = $state(false);
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
                    {#each set.appearances as appearance (appearance)}
                        {@const modifiedAppearances = appearance.modifiedAppearances.slice(
                            0,
                            masochist ? 9999 : 1
                        )}
                        {#each modifiedAppearances as modifiedAppearance (modifiedAppearance)}
                            {@const has = masochist
                                ? userState.general.hasAppearanceBySource.has(
                                      modifiedAppearance.sourceId
                                  )
                                : userState.general.hasAppearanceById.has(appearance.appearanceId)}
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
