<script lang="ts">
    import { lazyStore } from '@/stores'
    import type { JournalDataEncounter, JournalDataEncounterItemGroup, JournalDataInstance } from '@/types/data'
    
    import EncounterStats from './JournalEncounterStats.svelte'
    import Group from './JournalGroup.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let encounter: JournalDataEncounter
    export let instance: JournalDataInstance
    export let slugKey: string

    $: statsKey = `${slugKey}--${encounter.name}`
    $: useV2 = encounter.groups.length > 3 && encounter.groups.reduce(reduceFunc, 0) > 30

    const reduceFunc = function(a: number, b: JournalDataEncounterItemGroup) {
        const groupKey = `${statsKey}--${b.name}`
        const groupFiltered = $lazyStore.journal.filteredItems[groupKey]
        if (!groupFiltered) {
            console.log('No stats for group', groupKey)
            return a
        }
        else {
            return a + $lazyStore.journal.filteredItems[`${statsKey}--${b.name}`]
                .filter((item) => item.show)
                .reduce((a, b) => a + b.appearances.length, 0)
        }
    }
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle
    title={encounter.name}
    count={$lazyStore.journal.stats[statsKey]}
>
    <EncounterStats
        {encounter}
        {statsKey}
    />
</SectionTitle>

<div class="collection{useV2 ? '-v2' : ''}-section" data-encounter-id="{encounter.id}">
    {#each encounter.groups as group}
        <Group
            groupKey={`${slugKey}--${encounter.name}--${group.name}`}
            {bonusIds}
            {group}
            {instance}
            {useV2}
        />
    {/each}
</div>
