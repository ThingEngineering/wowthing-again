<script lang="ts">
    import { typeOrder } from '@/data/inventory-type';
    import { weaponSubclassOrder, weaponSubclassToString } from '@/data/weapons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { staticStore } from '@/shared/stores/static';
    import getPercentClass from '@/utils/get-percent-class';
    import type { TransmogSlotData } from '@/stores/lazy/transmog';
    import type { ManualDataTransmogGroupData } from '@/types/data/manual';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TooltipItems from './TooltipItems.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';
    import { itemStore } from '@/stores';

    export let have: number;
    export let set: ManualDataTransmogGroupData;
    export let setTitle: string;
    export let slotHave: TransmogSlotData;
    export let subType: string;
    export let total: number;

    let setName: string;
    let shiftPressed: boolean;

    $: completionist = settingsState.value.transmog.completionistMode;

    $: {
        setName = set.transmogSetId ? $staticStore.transmogSets[set.transmogSetId].name : set.name;
        if (!setName && set.itemsV2?.length === 1) {
            setName = $itemStore.items[set.itemsV2[0]?.[0]]?.name;
        }
    }

    let actualSlotOrder: number[];
    let showShift: boolean;
    let slotKeys: number[];
    let weapons: number[];
    $: {
        slotKeys = Object.keys(slotHave).map((key) => parseInt(key));
        weapons = slotKeys.filter((key) => key >= 100);
        actualSlotOrder =
            weapons.length > 0 ? weaponSubclassOrder.map((subClass) => 100 + subClass) : typeOrder;

        showShift =
            slotKeys.length > 1 && Object.values(slotHave).some(([, items]) => items?.length > 2);
    }

    function keyDown(event: KeyboardEvent) {
        shiftPressed = event.shiftKey;
    }
    function keyUp(event: KeyboardEvent) {
        shiftPressed = event.shiftKey;
    }
</script>

<style lang="scss">
    table {
        --scale: 0.9;
    }
    .have {
        width: 2.3rem;
    }
    .type {
        text-align: left;
    }
    .slot-count {
        font-size: 0.9rem;
        word-spacing: -0.2ch;
    }
    .items {
        --image-border-width: 1px;

        text-align: left;

        :global(span[data-string='yes']) {
            color: $color-success;
        }

        :global(span[data-string='no']) {
            color: $color-fail;
        }
    }
</style>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<div class="wowthing-tooltip">
    <h4>{setName}</h4>
    {#if subType}
        <h5>
            <ParsedText text="{subType}{setTitle ? ' - ' + setTitle : ''}" />
        </h5>
    {/if}
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each actualSlotOrder as type}
                {#if slotHave[type] !== undefined}
                    {@const [slotCollected, slotItems] = slotHave[type]}
                    {@const actualSlotItems = slotItems || []}
                    {@const have = actualSlotItems.filter(([, haveSource]) => haveSource).length}
                    <tr>
                        <td class="have">
                            <YesNoIcon
                                state={settingsState.value.transmog.completionistMode
                                    ? have >= actualSlotItems.length
                                    : slotCollected}
                                useStatusColors={true}
                            />
                        </td>
                        <td class="type">
                            {#if type >= 100}
                                {weaponSubclassToString[type - 100]}
                            {:else}
                                {$staticStore.inventoryTypes[type]}
                            {/if}
                            {#if completionist && slotItems?.length >= 2}
                                <div
                                    class="slot-count {getPercentClass(
                                        (have / slotItems.length) * 100,
                                    )}"
                                >
                                    {have} / {slotItems.length}
                                </div>
                            {/if}
                        </td>
                        <td class="items">
                            {#if showShift && shiftPressed}
                                <TooltipItems
                                    dedupe={false}
                                    items={actualSlotItems.filter(([hasAppearance, hasSource]) =>
                                        have < actualSlotItems.length
                                            ? settingsState.value.transmog.completionistMode
                                                ? !hasSource
                                                : !hasAppearance
                                            : true,
                                    )}
                                />
                            {:else if slotKeys.length === 1}
                                <TooltipItems dedupe={false} items={actualSlotItems} />
                            {:else if slotHave[type][1]?.length > 0}
                                <TooltipItems items={actualSlotItems} />
                            {/if}
                        </td>
                    </tr>
                {/if}
            {/each}
            {#if showShift && !shiftPressed}
                <tr>
                    <td colspan="100"
                        >Hold Shift to see all {have < total ? 'missing' : ''} items!</td
                    >
                </tr>
            {/if}
        </tbody>
    </table>
</div>
