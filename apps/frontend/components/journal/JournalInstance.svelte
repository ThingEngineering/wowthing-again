<script lang="ts">
    import find from 'lodash/find';

    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { JournalDataInstance } from '@/types/data';

    import Encounter from './JournalEncounter.svelte';
    import EncounterStats from './JournalEncounterStats.svelte';
    import Lockouts from './Lockouts.svelte';
    import Options from './JournalOptions.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    let { slug1, slug2, slug3 }: { slug1: string; slug2: string; slug3: string } = $props();

    let tier = $derived.by(() => find(wowthingData.journal.tiers, (tier) => tier?.slug === slug1));
    let [instance, slugKey] = $derived.by(() => {
        let instance: JournalDataInstance;
        let slugKey: string;

        if (tier) {
            if (tier.subTiers) {
                const subTier = find(tier.subTiers, (subTier) => subTier.slug === slug2);
                if (subTier) {
                    instance = find(subTier.instances, (instance) => instance?.slug === slug3);
                    slugKey = `${slug2}--${slug3}`;
                }
            } else {
                instance = find(tier.instances, (instance) => instance?.slug === slug2);
                slugKey = `${slug1}--${slug2}`;
            }
        }

        return [instance, slugKey];
    });

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'collection-v2-group', {
                columnCount: '--column-count',
                gap: 30,
                padding: '1.5rem',
            });
        } else {
            return null;
        }
    });

    $effect(() => debouncedResize?.());
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
            <div class="collection thing-container" data-instance-id={instance.id}>
                <SectionTitle title={instance.name} count={lazyState.journal.stats[slugKey]}>
                    <EncounterStats statsKey={slugKey} />
                </SectionTitle>

                {#if browserState.current.journal.showLockouts}
                    <Lockouts {instance} />
                {/if}

                {#each instance.encounters as encounter}
                    {#if (browserState.current.journal.showConvertible || encounter.name !== 'Convertible') && (browserState.current.journal.showTrash || encounter.name !== 'Trash Drops')}
                        <Encounter {encounter} {instance} {slugKey} bonusIds={instance.bonusIds} />
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>
