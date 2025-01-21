<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { getColumnResizer } from '@/utils/get-column-resizer'
    import { itemStore, journalStore, userStore } from '@/stores';
    import type { JournalDataInstance, JournalDataTier } from '@/types/data/journal';

    import Instance from './Instance.svelte';
    import Options from './Options.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    type InstanceData = [JournalDataInstance, number[]][];
    type TierData = [JournalDataTier, InstanceData][];
    let tiers: TierData;
    $: {
        const lookup = new Set($journalStore.tokenEncounters);

        tiers = [];
        for (const tier of $journalStore.tiers) {
            if (tier === null) { break; }
            if (!lookup.has(tier.id.toString())) { continue; }

            const instances: InstanceData = [];

            for (const instance of tier.instances.filter((instance) => !!instance)) {
                if (!lookup.has(`${tier.id}|${instance.id}`)) { continue; }

                const items: Set<number> = new Set();

                for (const encounter of instance.encounters) {
                    if (!lookup.has(`${tier.id}|${instance.id}|${encounter.id}`)) { continue; }

                    for (const group of encounter.groups) {
                        for (const item of group.items) {
                            const sourceIds = $journalStore.expandedItem[item.id] || [];
                            for (const sourceId of sourceIds) {
                                if ($userStore.itemsById[sourceId]) {
                                    items.add(sourceId);
                                }
                            }
                        }
                    }
                }

                if (items.size > 0) {
                    const itemsArray = Array.from(items);
                    itemsArray.sort((a, b) => $itemStore.items[a].name.localeCompare($itemStore.items[b].name));

                    instances.push([instance, itemsArray]);
                }
            }

            if (instances.length > 0) {
                tiers.push([tier, instances]);
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
                    padding: '0.75rem'
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

<svelte:window on:resize={debouncedResize} />

<UnderConstruction />

<div class="resizer-view" bind:this={containerElement}>
    <Options />

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each tiers as [tier, instances]}
            {#each instances as [instance, items]}
                <Instance
                    name="{tier.name} > {instance.name}"
                    {instance}
                    {items}
                />
            {/each}
        {/each}
    </div>
</div>
