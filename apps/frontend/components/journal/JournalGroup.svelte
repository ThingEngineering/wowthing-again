<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer'

    import { lazyStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import type { JournalDataEncounterItem, JournalDataEncounterItemGroup, JournalDataInstance } from '@/types/data'

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte'
    import Item from './JournalItem.svelte'

    export let bonusIds: Record<number, number>
    export let group: JournalDataEncounterItemGroup
    export let groupKey: string
    export let instance: JournalDataInstance
    export let useV2: boolean

    let element: HTMLElement
    let intersected: boolean
    let items: JournalDataEncounterItem[]
    $: {
        items = $lazyStore.journal.filteredItems[groupKey].filter((item) => item.show)
    }
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
    {@const stats = $lazyStore.journal.stats[groupKey]}
    <div class="collection{useV2 ? '-v2' : ''}-group">
        <h4 class="drop-shadow {getPercentClass(stats.percent)}">
            {group.name}
            <CollectibleCount counts={stats} />
        </h4>

        <div
            bind:this={element}
            class="collection-objects"
        >
            <IntersectionObserver
                bind:intersecting={intersected}
                once
                {element}
            >
                {#if intersected}
                    {#each items as item}
                        <Item
                            {bonusIds}
                            {instance}
                            {item}
                        />
                    {/each}
                {/if}
            </IntersectionObserver>
        </div>
    </div>
{/if}
