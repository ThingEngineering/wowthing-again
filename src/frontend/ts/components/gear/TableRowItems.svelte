<script lang="ts">
    import {getContext} from 'svelte'

    import {slotOrder} from '../../data/inventory-slot'

    import GearItem from './TableRowItem.svelte'

    export let rowspan: number = undefined

    $: character = getContext('character')
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
