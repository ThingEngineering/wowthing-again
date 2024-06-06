<script lang="ts">
    import { bestTypeOrder } from '@/data/inventory-type';
    import { Faction } from '@/enums/faction';
    import { InventoryType } from '@/enums/inventory-type';
    import { staticStore } from '@/shared/stores/static';
    import { itemStore } from '@/stores';
    import { exploreState } from '@/stores/local-storage'
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { StaticDataTransmogSet } from '@/shared/stores/static/types';
    import type { ItemDataItem } from '@/types/data/item';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    let slots: Record<number, ItemDataItem[]>
    let transmogSet: StaticDataTransmogSet
    $: {
        slots = {}
        transmogSet = $staticStore.transmogSets[$exploreState.transmogSetId]
        if (transmogSet) {
            for (const [itemId,] of transmogSet.items) {
                const item = $itemStore.items[itemId];
                (slots[item.inventoryType] ||= []).push(item)
            }
        }
    }
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
    <NumberInput
        name="explore_transmog_set_id"
        minValue={0}
        maxValue={999999}
        bind:value={$exploreState.transmogSetId}
    />

    {#if transmogSet}
        {@const classes = getClassesFromMask(transmogSet.classMask)}
        <h3>
            {#if transmogSet.allianceOnly}
                <FactionIcon faction={Faction.Alliance} />
            {:else if transmogSet.hordeOnly}
                <FactionIcon faction={Faction.Horde} />
            {/if}

            {transmogSet.name}

            {#each classes as characterClass}
                <ClassIcon classId={characterClass} />
            {:else}
                All classes
            {/each}
        </h3>
        <div class="slots">
            {#each bestTypeOrder as inventoryType}
                {#if slots[inventoryType]}
                    <div class="slot">
                        <h4>{InventoryType[inventoryType]}</h4>
                        {#each slots[inventoryType] as item}
                            {@const itemClasses = getClassesFromMask(item.classMask)}
                            <div class="item">
                                <WowheadLink type={'item'} id={item.id}>
                                    {#each itemClasses as classId}
                                        <ClassIcon {classId} />
                                    {/each}
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
