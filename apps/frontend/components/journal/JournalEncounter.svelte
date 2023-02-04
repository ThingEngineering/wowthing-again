<script lang="ts">
    import { journalStore } from '@/stores'
    import type { JournalDataEncounter, JournalDataEncounterItemGroup } from '@/types/data'
    
    import EncounterStats from './JournalEncounterStats.svelte'
    import Group from './JournalGroup.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'

    export let bonusIds: Record<number, number> = undefined
    export let encounter: JournalDataEncounter
    export let slugKey: string

    $: statsKey = `${slugKey}--${encounter.name}`
    $: useV2 = encounter.groups.length > 3 && encounter.groups.reduce(reduceFunc, 0) > 30

    const reduceFunc = function(a: number, b: JournalDataEncounterItemGroup) {
        return a + b.filteredItems.filter((item) => item.show).reduce((a, b) => a + b.appearances.length, 0)
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
    count={$journalStore.stats[statsKey]}
>
    <EncounterStats
        {encounter}
        {statsKey}
    />
</SectionTitle>

<div class="collection{useV2 ? '-v2' : ''}-section" data-encounter-id="{encounter.id}">
    {#each encounter.groups as group}
        <Group
            {bonusIds}
            stats={$journalStore.stats[`${slugKey}--${encounter.name}--${group.name}`]}
            {group}
            {useV2}
        />
    {/each}
</div>
