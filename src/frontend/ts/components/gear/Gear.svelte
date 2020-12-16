<script lang="ts">
    import {slotOrder} from '../../data/inventory-slot'
    import {data as userData} from '../../stores/user-store'
    import getRealmName from '../../utils/get-realm-name'

    import GearItem from './GearItem.svelte'
    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    div {
        background: $thing-background;
        border: 1px solid $border-color;
        padding: 0.5rem 0.75rem;
    }
</style>

<div>
    <table>
        {#each $userData.characters as character}
            <tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
                <td><RaceIcon character={character} size=20 /></td>
                <td><ClassIcon character={character} size=20 /></td>
                <td>{character.name}</td>
                <td>&mdash; {getRealmName(character.realmId)}</td>
                <td>⚔</td>
                <td style="text-align: right">{character.equippedItemLevel}</td>
                {#each slotOrder as inventorySlot}
                    <GearItem {character} {inventorySlot} />
                {/each}
            </tr>
        {/each}
    </table>
</div>
