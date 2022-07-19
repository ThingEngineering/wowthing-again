<script lang="ts">
    import find from 'lodash/find'

    import { journalStore, staticStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

    import Group from './JournalGroup.svelte'
    import Options from './JournalOptions.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'

    export let slug1: string
    export let slug2: string

    let instance: JournalDataInstance
    $: {
        instance = undefined
        const tier: JournalDataTier = find($journalStore.data.tiers, (tier) => tier?.slug === slug1)
        if (tier) {
            instance = find(tier.instances, (instance) => instance.slug === slug2)
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
</style>

<div class="wrapper">
    <Options />

    {#if instance}
        <div class="collection thing-container" data-instance-id="{instance.id}">
            {#each instance.encounters as encounter}
                {#if $journalState.showTrash || encounter.name !== 'Trash Drops'}
                    <SectionTitle
                        title={encounter.name}
                        count={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}`]}
                    >
                    </SectionTitle>

                    <div class="collection-section" data-encounter-id="{encounter.id}">
                        {#each encounter.groups as group}
                            <Group
                                bonusIds={instance.bonusIds}
                                instanceExpansion={$staticStore.data.instances[instance.id]?.expansion ?? 0}
                                stats={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}--${group.name}`]}
                                {group}
                            />
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
