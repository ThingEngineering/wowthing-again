<script lang="ts">
    import { getContext } from 'svelte'

    import type { Character } from '@/types'
    import { slotOrder } from '@/data/inventory-slot'

    import RowItem from './TableRowItem.svelte'

    export let character: Character = undefined
    export let rowspan = 1

    $: character = character || getContext('character')
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

<td class="spacer" {rowspan}>&nbsp;</td>
{#each slotOrder as inventorySlot}
    <td class="gear" {rowspan}>
        <RowItem {character} {inventorySlot} />
    </td>
{/each}
