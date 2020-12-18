<script lang="ts">
    import {slotOrder} from '../../data/inventory-slot'
    import {data as userData} from '../../stores/user-store'
    import getRealmName from '../../utils/get-realm-name'

    import GearItem from './GearItem.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'
    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    div {
        padding: 0 0.5rem;
    }
</style>

<div class="thing-container">
    <table class="table-striped">
        <tbody>
            {#each $userData.characters as character}
                <tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
                    <td><RaceIcon character={character} size=20 /></td>
                    <td><ClassIcon character={character} size=20 /></td>
                    <td>{character.name}</td>
                    <td>&mdash; {getRealmName(character.realmId)}</td>
                    <TableItemLevel {character} />
                    {#each slotOrder as inventorySlot}
                        <GearItem {character} {inventorySlot} />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
