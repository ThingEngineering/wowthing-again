<script lang="ts">
    import {typeOrder} from '@/data/inventory-type'
    import type {Dictionary} from '@/types'
    import type {TransmogDataGroupData} from '@/types/data'
    import {InventoryType} from '@/types/enums'

    export let set: TransmogDataGroupData
    export let slotHave: Dictionary<boolean>
    export let subType: string

    console.log({set, slotHave})
</script>

<style lang="scss">
    .have {
        width: 2.3rem;
    }
    .type {
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{set.name}</h4>
    {#if subType}
        <h5>{subType}</h5>
    {/if}
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each typeOrder as type}
                {#if slotHave[type] !== undefined}
                    <tr>
                        <td class="have">{slotHave[type] ? '✔' : '❌'}</td>
                        <td class="type">{InventoryType[type]}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>
