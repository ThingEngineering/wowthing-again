<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import { getNumberKeys } from '@/utils/get-number-keyed-entries';
    import type { JournalDataInstance, JournalDataTier } from '@/types/data/journal';

    import Instance from './Instance.svelte';
    import Options from './Options.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    type InstanceData = [JournalDataInstance, number[]][];
    type TierData = [JournalDataTier, InstanceData][];

    let tiers = $derived.by(() => {
        const lookup = new Set(wowthingData.journal.tokenEncounters);
        const hasItemsById = new Set(getNumberKeys(userState.general.itemsById));

        const ret: TierData = [];
        for (const tier of wowthingData.journal.tiers) {
            if (tier === null) {
                break;
            }
            if (!lookup.has(tier.id.toString())) {
                continue;
            }

            const instances: InstanceData = [];

            for (const instance of tier.instances.filter((instance) => !!instance)) {
                if (!lookup.has(`${tier.id}|${instance.id}`)) {
                    continue;
                }

                const items: Set<number> = new Set();

                for (const encounter of instance.encounters) {
                    if (!lookup.has(`${tier.id}|${instance.id}|${encounter.id}`)) {
                        continue;
                    }

                    for (const group of encounter.groups) {
                        for (const item of group.items) {
                            const sourceIds = wowthingData.journal.expandedItem[item.id] || [];
                            for (const sourceId of sourceIds) {
                                if (hasItemsById.has(sourceId)) {
                                    items.add(sourceId);
                                }
                            }
                        }
                    }
                }

                if (items.size > 0) {
                    const itemsArray = Array.from(items);
                    itemsArray.sort((a, b) =>
                        wowthingData.items.items[a].name.localeCompare(
                            wowthingData.items.items[b].name
                        )
                    );

                    instances.push([instance, itemsArray]);
                }
            }

            if (instances.length > 0) {
                ret.push([tier, instances]);
            }
        }

        return ret;
    });

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'collection-v2-group', {
                columnCount: '--column-count',
                gap: 30,
                padding: '0.75rem',
            });
        } else {
            return null;
        }
    });

    $effect(() => debouncedResize?.());
</script>

<svelte:window on:resize={debouncedResize} />

<UnderConstruction />

<div class="resizer-view" bind:this={containerElement}>
    <Options />

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each tiers as [tier, instances]}
            {#each instances as [instance, items]}
                <Instance name="{tier.name} > {instance.name}" {instance} {items} />
            {/each}
        {/each}
    </div>
</div>
