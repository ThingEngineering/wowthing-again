<script lang="ts">
    import { typeOrder } from '@/data/inventory-type'
    import { staticStore } from '@/stores'
    import type { TransmogSlotData } from '@/stores/lazy/transmog'
    import type { ManualDataTransmogGroupData } from '@/types/data/manual'

    import ParsedText from '@/components/common/ParsedText.svelte'

    export let set: ManualDataTransmogGroupData
    export let setTitle: string
    export let slotHave: TransmogSlotData
    export let subType: string

    let setName: string
    $: setName = set.transmogSetId
        ? $staticStore.transmogSets[set.transmogSetId].name
        : set.name
    
    $: weapons = Object.keys(slotHave).filter((key) => parseInt(key) >= 100)
</script>

<style lang="scss">
    .have {
        width: 2.3rem;
    }
    .type {
        text-align: left;
    }
    .items {
        text-align: left;

        :global(span[data-string="yes"]) {
            color: $colour-success;
        }

        :global(span[data-string="no"]) {
            color: $colour-fail;
        }
    }
</style>

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
                        <tr>
                            <td class="have">{slotHave[type][0] ? '✔' : '❌'}</td>
                            <td class="type">{$staticStore.inventoryTypes[type]}</td>
                            {#if slotHave[type][1]?.length > 0}
                                <td class="items">
                                    {#each slotHave[type][1] as [itemHave, itemId]}
                                        <div class="item">
                                            <ParsedText
                                                text={`:${itemHave ? 'yes' : 'no'}: {item:${itemId}}`}
                                            />
                                        </div>
                                    {/each}
                                </td>
                            {/if}
                        </tr>
                    {/if}
                {/each}
            {/if}
        </tbody>
    </table>
</div>
