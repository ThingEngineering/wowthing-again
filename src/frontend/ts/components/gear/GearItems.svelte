<script lang="ts">
    import {slotOrder} from '../../data/inventory-slot'
    import type {Character} from '../../types'

    import GearItem from './GearItem.svelte'

    export let character: Character
    export let rowspan: number
</script>

<style lang="scss">
    .spacer {
        width: 0.5rem;
    }
    .gear {
        padding: 2px;
        text-align: center;
        width: 46px;
    }
</style>

<td class="spacer" rowspan="{rowspan}"></td>
{#each slotOrder as inventorySlot}
    <td class="gear" rowspan="{rowspan}">
        <GearItem {character} {inventorySlot} />
    </td>
{/each}
