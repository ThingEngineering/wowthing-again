<script lang="ts">
    import { bestTypeOrder } from '@/data/inventory-type';
    import { weaponSubclassOrder } from '@/data/weapons';
    import { Faction } from '@/enums/faction';
    import { InventoryType, weaponInventoryTypes } from '@/enums/inventory-type';
    import { WeaponSubclass } from '@/enums/weapon-subclass';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { fixedInventoryType } from '@/utils/fixed-inventory-type';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { ItemDataItem } from '@/types/data/item';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    const slotOrder = bestTypeOrder.concat(weaponSubclassOrder.map((sub) => sub + 100));

    let transmogSet = $derived(
        wowthingData.static.transmogSetById.get(browserState.current.explore.transmogSetId)
    );

    let learnedFromItems = $derived(
        (
            wowthingData.items.transmogSetToItems[browserState.current.explore.transmogSetId] || []
        ).map((itemId) => wowthingData.items.items[itemId])
    );

    let slots = $derived.by(() => {
        const ret: Record<number, ItemDataItem[]> = {};
        if (transmogSet) {
            for (const [itemId] of transmogSet.items) {
                const isPrimary = itemId > 10_000_000;
                const item = wowthingData.items.items[itemId % 10_000_000];
                if (!item) {
                    console.warn('Invalid item', itemId);
                    continue;
                }

                let actualSlot: number;
                if (weaponInventoryTypes.has(item.inventoryType)) {
                    actualSlot = 100 + item.subclassId;
                } else {
                    actualSlot = fixedInventoryType(item.inventoryType);
                }

                const slotItems = (ret[actualSlot] ||= []);
                if (isPrimary) {
                    slotItems.unshift(item);
                } else {
                    slotItems.push(item);
                }
            }
        }
        return ret;
    });
</script>

<style lang="scss">
    .thing-container {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 1rem;
        width: 100%;

        :global(input) {
            margin-bottom: 1rem;
            width: 10rem;
        }
    }
    .flex-wrapper {
        align-items: center;
        gap: 0.5rem;
        justify-content: flex-start;

        :global(input) {
            margin: 0.5rem 0;
        }
    }
    .slots {
        columns: 4;
    }
    .slot {
        break-inside: avoid;
        margin-bottom: 1rem;
        overflow: hidden; /* Firefox fix */
    }
    .item {
        :global(img:not(:first-child)) {
            margin-left: 2px;
        }
    }
</style>

<div class="thing-container border">
    <div class="flex-wrapper">
        <NumberInput
            name="explore_transmog_set_id"
            minValue={0}
            maxValue={999999}
            bind:value={browserState.current.explore.transmogSetId}
        />

        {#each learnedFromItems as learnedFromItem (learnedFromItem.id)}
            <WowheadLink type="item" id={learnedFromItem.id}>
                <WowthingImage name="item/{learnedFromItem.id}" size={16} />
                <ParsedText text={`{item:${learnedFromItem.id}}`} />
            </WowheadLink>
        {:else}
            No ensemble items.
        {/each}
    </div>

    {#if transmogSet}
        {@const classes = getClassesFromMask(transmogSet.classMask)}
        <h3>
            {#if transmogSet.allianceOnly}
                <FactionIcon faction={Faction.Alliance} />
            {:else if transmogSet.hordeOnly}
                <FactionIcon faction={Faction.Horde} />
            {/if}

            {transmogSet.name}

            {#each classes as characterClass (characterClass)}
                <ClassIcon classId={characterClass} />
            {:else}
                ???
            {/each}
        </h3>
        <div class="slots">
            {#each slotOrder as slot (slot)}
                {#if slots[slot]}
                    <div class="slot">
                        <h4>
                            {#if slot >= 100}
                                {WeaponSubclass[slot - 100]}
                            {:else}
                                {InventoryType[slot]}
                            {/if}
                        </h4>
                        {#each slots[slot] as item (item.id)}
                            {@const itemClasses = getClassesFromMask(item.classMask)}
                            <div class="item">
                                <WowheadLink type="item" id={item.id}>
                                    {#if itemClasses.length < 13}
                                        {#each itemClasses as classId (classId)}
                                            <ClassIcon {classId} />
                                        {/each}
                                    {/if}
                                    <ParsedText text={`{item:${item.id}}`} />
                                </WowheadLink>
                            </div>
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
