<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer'

    import getPercentClass from '@/utils/get-percent-class'
    import type { UserCount } from '@/types'
    import type { JournalDataEncounterItem, JournalDataEncounterItemGroup } from '@/types/data'

    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import Item from './JournalItem.svelte'

    export let bonusIds: Record<number, number>
    export let group: JournalDataEncounterItemGroup
    export let stats: UserCount
    export let useV2: boolean

    let element: HTMLElement
    let intersected: boolean
    let items: JournalDataEncounterItem[]
    let percent: number
    $: {
        percent = Math.floor((stats?.have ?? 0) / (stats?.total ?? 1) * 100)

        items = group.filteredItems.filter((item) => item.show)
    }
</script>

<style lang="scss">
    .collection-objects {
        min-height: 52px;
    }
</style>

{#if items.length > 0}
    <div class="collection{useV2 ? '-v2' : ''}-group">
        <h4 class="drop-shadow {getPercentClass(percent)}">
            {group.name}
            <CollectionCount counts={stats} />
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
                            {item}
                        />
                    {/each}
                {/if}
            </IntersectionObserver>
        </div>
    </div>
{/if}
