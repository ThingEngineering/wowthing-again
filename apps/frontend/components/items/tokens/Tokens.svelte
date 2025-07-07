<script lang="ts">
    import { itemModifierOrder } from '@/data/item-modifier';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import { getBonusIdModifier } from '@/utils/items/get-bonus-id-modifier';
    import type { JournalDataInstance, JournalDataTier } from '@/types/data/journal';

    import Instance from './Instance.svelte';
    import Options from './Options.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    type InstanceData = [JournalDataInstance, string[]][];
    type TierData = [JournalDataTier, InstanceData][];

    let tiers = $derived.by(() => {
        const lookup = new Set(wowthingData.journal.tokenEncounters);
        // const itemsById = $state.snapshot(userState.general.itemsById);

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

                const items = new Set<string>();

                for (const encounter of instance.encounters) {
                    if (!lookup.has(`${tier.id}|${instance.id}|${encounter.id}`)) {
                        continue;
                    }

                    for (const group of encounter.groups) {
                        for (const item of group.items) {
                            const expandedItemIds =
                                wowthingData.journal.expandedItem[item.id] || [];
                            for (const expandedItemId of expandedItemIds) {
                                const haveItems = userState.general.itemsById[expandedItemId];
                                for (const [, userItems] of haveItems || []) {
                                    for (const userItem of userItems) {
                                        const modifier = getBonusIdModifier(userItem.bonusIds);
                                        items.add(
                                            `${expandedItemId}|${modifier}|${userItem.bonusIds.join(',')}`
                                        );
                                    }
                                }
                            }
                        }
                    }
                }

                if (items.size > 0) {
                    const itemsArray = Array.from(items);
                    itemsArray.sort((a, b) => {
                        const aParts = a.split('|').map((s) => parseInt(s));
                        const bParts = b.split('|').map((s) => parseInt(s));

                        const aName = wowthingData.items.items[aParts[0]].name;
                        const bName = wowthingData.items.items[bParts[0]].name;
                        if (aName !== bName) {
                            return aName.localeCompare(bName);
                        }

                        return (
                            (itemModifierOrder[aParts[1]] || 0) -
                            (itemModifierOrder[bParts[1]] || 0)
                        );
                    });

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
        {#each tiers as [tier, instances] (tier.id)}
            {#each instances as [instance, items] (instance.id)}
                <Instance name="{tier.name} > {instance.name}" {instance} {items} />
            {/each}
        {/each}
    </div>
</div>
