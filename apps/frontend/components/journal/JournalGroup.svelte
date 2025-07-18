<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type {
        JournalDataEncounter,
        JournalDataEncounterItemGroup,
        JournalDataInstance,
    } from '@/types/data';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import Item from './JournalItem.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    type Props = {
        bonusIds: Record<number, number>;
        encounter: JournalDataEncounter;
        group: JournalDataEncounterItemGroup;
        groupKey: string;
        instance: JournalDataInstance;
        useV2: boolean;
    };
    let { bonusIds, encounter, group, groupKey, instance, useV2 }: Props = $props();

    let element = $state<HTMLElement>(null);
    let intersected = $state(false);
    let items = $derived(
        (lazyState.journal.filteredItems[groupKey] || []).filter((item) => item.show)
    );
</script>

<style lang="scss">
    h4 {
        margin-bottom: 0.2rem;
    }
    .collection-v2-group {
        width: 28.1rem;
    }
    .collection-objects {
        min-height: 52px;
    }
</style>

{#if items.length > 0}
    {@const stats = lazyState.journal.stats[groupKey]}
    <div class="collection{useV2 ? '-v2' : ''}-group">
        <h4 class="drop-shadow {getPercentClass(stats.percent)}">
            <ParsedText text={group.name} />
            <CollectibleCount counts={stats} />
        </h4>

        <div bind:this={element} class="collection-objects">
            <IntersectionObserver bind:intersecting={intersected} once {element}>
                {#if intersected}
                    {#each items as item}
                        <Item {bonusIds} {encounter} {instance} {item} />
                    {/each}
                {/if}
            </IntersectionObserver>
        </div>
    </div>
{/if}
