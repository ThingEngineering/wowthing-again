<script lang="ts">
    import {slotOrder} from '../../data/inventory-slot'
    import type {Character} from '../../types'

    import GearItem from './GearItem.svelte'

    export let character: Character
</script>

<style lang="scss">
    .spacer {
        width: 0.5rem;
    }
</style>

<td class="spacer"></td>
{#each slotOrder as inventorySlot}
    <GearItem {character} {inventorySlot} />
{/each}
