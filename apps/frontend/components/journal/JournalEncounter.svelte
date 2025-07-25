<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import type {
        JournalDataEncounter,
        JournalDataEncounterItemGroup,
        JournalDataInstance,
    } from '@/types/data';

    import EncounterStats from './JournalEncounterStats.svelte';
    import Group from './JournalGroup.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    type Props = {
        bonusIds?: Record<number, number>;
        encounter: JournalDataEncounter;
        instance: JournalDataInstance;
        slugKey: string;
    };
    let { bonusIds, encounter, instance, slugKey }: Props = $props();

    let statsKey = $derived(`${slugKey}--${encounter.name}`);

    const reduceFunc = function (a: number, b: JournalDataEncounterItemGroup) {
        const groupKey = `${statsKey}--${b.name}`;
        const groupFiltered = lazyState.journal.filteredItems[groupKey];
        if (!groupFiltered) {
            console.log('No stats for group', groupKey);
            return a;
        } else {
            return (
                a +
                lazyState.journal.filteredItems[`${statsKey}--${b.name}`]
                    .filter((item) => item.show)
                    .reduce((a, b) => a + b.appearances.length, 0)
            );
        }
    };
    let useV2 = $derived(
        encounter.groups.length > 3 && encounter.groups.reduce(reduceFunc, 0) > 30
    );

    let encounterName = $derived.by(() => {
        if (encounter.allianceOnly) {
            return `:alliance: ${encounter.name}`;
        } else if (encounter.hordeOnly) {
            return `:horde: ${encounter.name}`;
        } else {
            return encounter.name;
        }
    });
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle title={encounterName} count={lazyState.journal.stats[statsKey]}>
    <EncounterStats {encounter} {statsKey} />
</SectionTitle>

<div class="collection{useV2 ? '-v2' : ''}-section" data-encounter-id={encounter.id}>
    {#each encounter.groups as group (group)}
        <Group
            groupKey={`${statsKey}--${group.name}`}
            {bonusIds}
            {encounter}
            {group}
            {instance}
            {useV2}
        />
    {/each}
</div>
