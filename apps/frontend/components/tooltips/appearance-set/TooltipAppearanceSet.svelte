<script lang="ts">
    import { typeOrder } from '@/data/inventory-type'
    import { InventoryType } from '@/enums'
    import type { ManualDataTransmogGroup } from '@/types/data/manual'

    export let set: ManualDataTransmogGroup
    export let slotHave: Record<number, boolean>
    export let subType: string
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
