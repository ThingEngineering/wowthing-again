<script lang="ts">
    import { typeOrder } from '@/data/inventory-type'
    import { staticStore } from '@/shared/stores/static'
    import getPercentClass from '@/utils/get-percent-class';
    import type { TransmogSlotData } from '@/stores/lazy/transmog'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import TooltipItems from './TooltipItems.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'

    export let set: ManualDataTransmogGroupData
    export let setTitle: string
    export let slotHave: TransmogSlotData
    export let subType: string

    let setName: string
    let shiftPressed: boolean

    $: setName = set.transmogSetId
        ? $staticStore.transmogSets[set.transmogSetId].name
        : set.name
    
    $: weapons = Object.keys(slotHave).filter((key) => parseInt(key) >= 100)

    function keyDown(event: KeyboardEvent) {
        shiftPressed = event.shiftKey
    }
    function keyUp(event: KeyboardEvent) {
        shiftPressed = event.shiftKey
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
        text-align: left;

        :global(span[data-string="yes"]) {
            color: $color-success;
        }

        :global(span[data-string="no"]) {
            color: $color-fail;
        }
    }
</style>

<svelte:window on:keydown={keyDown} on:keyup={keyUp}/>

<div class="wowthing-tooltip">
    <h4>{setName}</h4>
    {#if subType}
        <h5>
            <ParsedText text={subType}{setTitle ? ' - ' + setTitle : ''} />
        </h5>
    {/if}
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#if weapons.length > 0}
                <!-- NYI -->
            {:else}
                {#each typeOrder as type}
                    {#if slotHave[type] !== undefined}
                        {@const [slotCollected, slotItems] = slotHave[type]}
                        {@const have = slotItems.filter(([data,]) => data).length}
                        <tr>
                            <td class="have">
                                <YesNoIcon state={slotCollected} useStatusColors={true} />
                            </td>
                            <td class="type">
                                {$staticStore.inventoryTypes[type]}
                                {#if slotItems?.length > 2}
                                    <div class="slot-count {getPercentClass(have / slotItems.length * 100)}">
                                        {have} / {slotItems.length}
                                    </div>
                                {/if}
                            </td>
                            {#if shiftPressed}
                                <td class="items">
                                    <TooltipItems
                                        dedupe={false}
                                        items={slotItems.filter(([itemCollected,]) => !itemCollected)}
                                    />
                                </td>
                            {:else}
                                {#if slotHave[type][1]?.length > 0}
                                    <td class="items">
                                        <TooltipItems items={slotItems.slice(0, 2)} />
                                    </td>
                                {/if}
                            {/if}
                        </tr>
                    {/if}
                {/each}
            {/if}
            {#if !shiftPressed}
                <tr>
                    <td colspan="100">Hold Shift to see missing items!</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
