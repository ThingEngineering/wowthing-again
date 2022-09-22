<script lang="ts">
    import find from 'lodash/find'

    import { journalStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import type { JournalDataEncounterItemGroup, JournalDataInstance, JournalDataTier } from '@/types/data'

    import EncounterStats from './JournalEncounterStats.svelte'
    import Group from './JournalGroup.svelte'
    import Options from './JournalOptions.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'

    export let slug1: string
    export let slug2: string
    export let slug3: string

    let instance: JournalDataInstance
    let slugKey: string
    $: {
        instance = undefined
        const tier: JournalDataTier = find($journalStore.data.tiers, (tier) => tier?.slug === slug1)
        if (tier) {
            if (tier.subTiers) {
                const subTier = find(tier.subTiers, (subTier) => subTier.slug === slug2)
                if (subTier) {
                    instance = find(subTier.instances, (instance) => instance.slug === slug3)
                    slugKey = `${slug2}--${slug3}`
                }
            }
            else {
                instance = find(tier.instances, (instance) => instance.slug === slug2)
                slugKey = `${slug1}--${slug2}`
            }
        }
    }

    const reduceFunc = function(a: number, b: JournalDataEncounterItemGroup) {
        return a + b.filteredItems.filter((item) => item.show).reduce((a, b) => a + b.appearances.length, 0)
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .collection > :global(div:first-child) {
        margin-bottom: 0.5rem;
    }
   .collection-v2-section {
        --column-count: 1;
        --column-gap: 1rem;
        --column-width: 18rem;

        width: 18.75rem;
        
        @media screen and (min-width: 1100px) {
            --column-count: 2;
            width: 37.75rem;
        }
        @media screen and (min-width: 1405px) {
            --column-count: 3;
            width: 56.75rem;
        }
        @media screen and (min-width: 1710px) {
            --column-count: 4;
            width: 75.75rem;
        }
        @media screen and (min-width: 2015px) {
            --column-count: 5;
            width: 94.75rem;
        }
    }
</style>

<div class="wrapper">
    <Options />

    {#if instance}
        <div class="collection thing-container" data-instance-id="{instance.id}">
            <SectionTitle
                title={instance.name}
                count={$journalStore.data.stats[slugKey]}
            >
                <EncounterStats
                    statsKey={slugKey}
                />
            </SectionTitle>

            {#each instance.encounters as encounter}
                {#if $journalState.showTrash || encounter.name !== 'Trash Drops'}
                    {@const statsKey = `${slugKey}--${encounter.name}`}
                    {@const useV2 = encounter.groups.length > 3 && encounter.groups.reduce(reduceFunc, 0) > 30}
                    <SectionTitle
                        title={encounter.name}
                        count={$journalStore.data.stats[statsKey]}
                    >
                        <EncounterStats
                            {encounter}
                            {statsKey}
                        />
                    </SectionTitle>

                    <div class="collection{useV2 ? '-v2' : ''}-section" data-encounter-id="{encounter.id}">
                        {#each encounter.groups as group}
                            <Group
                                bonusIds={instance.bonusIds}
                                stats={$journalStore.data.stats[`${slugKey}--${encounter.name}--${group.name}`]}
                                {group}
                                {useV2}
                            />
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
