<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate } from 'svelte'

    import { journalStore, lazyStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

    import Encounter from './JournalEncounter.svelte'
    import EncounterStats from './JournalEncounterStats.svelte'
    import Lockouts from './Lockouts.svelte';
    import Options from './JournalOptions.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'

    export let slug1: string
    export let slug2: string
    export let slug3: string

    let instance: JournalDataInstance
    let tier: JournalDataTier
    let slugKey: string
    $: {
        tier = find($journalStore.tiers, (tier) => tier?.slug === slug1)
        instance = undefined
        if (tier) {
            if (tier.subTiers) {
                const subTier = find(tier.subTiers, (subTier) => subTier.slug === slug2)
                if (subTier) {
                    instance = find(subTier.instances, (instance) => instance?.slug === slug3)
                    slugKey = `${slug2}--${slug3}`
                }
            }
            else {
                instance = find(tier.instances, (instance) => instance?.slug === slug2)
                slugKey = `${slug1}--${slug2}`
            }
        }
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '1.5rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }
    
    afterUpdate(() => debouncedResize?.())
</script>

<style lang="scss">
    .collection > :global(div:first-child) {
        margin-bottom: 0.5rem;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <div bind:this={resizeableElement}>
        <Options />

        {#if instance}
            <div class="collection thing-container" data-instance-id="{instance.id}">
                <SectionTitle
                    title={instance.name}
                    count={$lazyStore.journal.stats[slugKey]}
                >
                    <EncounterStats
                        statsKey={slugKey}
                    />
                </SectionTitle>

                {#if $journalState.showLockouts}
                    <Lockouts {instance} />
                {/if}

                {#each instance.encounters as encounter}
                    {#if $journalState.showTrash || encounter.name !== 'Trash Drops'}
                        <Encounter
                            {encounter}
                            {instance}
                            {slugKey}
                            bonusIds={instance.bonusIds}
                        />
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>
