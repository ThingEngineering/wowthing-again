<script lang="ts">
    import { userTransmogStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import getPercentClass from '@/utils/get-percent-class'
    import getFilteredItems from '@/utils/journal/get-filtered-items'
    import type { UserCount } from '@/types'
    import type { JournalDataEncounterItem, JournalDataEncounterItemGroup } from '@/types/data'

    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import Item from './JournalItem.svelte'

    export let bonusIds: Record<number, number>
    export let group: JournalDataEncounterItemGroup
    export let stats: UserCount

    let items: JournalDataEncounterItem[]
    let percent: number
    $: {
        items = getFilteredItems(
            $journalState,
            $settingsData,
            $userTransmogStore.data,
            group
        )
        percent = Math.floor((stats?.have ?? 0) / (stats?.total ?? 1) * 100)
    }
</script>

<style lang="scss">

</style>

{#if items.length > 0}
    <div class="collection-group">
        <h4 class="drop-shadow {getPercentClass(percent)}">
            {group.name}
            <CollectionCount counts={stats} />
        </h4>

        <div class="collection-objects">
            {#each items as item}
                <Item
                    {bonusIds}
                    {item}
                />
            {/each}
        </div>
    </div>
{/if}
