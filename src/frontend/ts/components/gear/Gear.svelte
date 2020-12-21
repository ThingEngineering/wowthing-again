<script lang="ts">
    import {afterUpdate} from 'svelte'

    import {slotOrder} from '../../data/inventory-slot'
    import {data as userData} from '../../stores/user-store'
    import getRealmName from '../../utils/get-realm-name'

    import GearItem from './GearItem.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'
    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import TableCharacterName from '../common/TableCharacterName.svelte'

    afterUpdate(() => {
        if (window.__tip) {
            window.__tip.watchElligibleElements()
        }
    })
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    div {
        padding: 0 0.5rem;
    }
    .spacer {
        width: 0.5rem;
    }
</style>

<div class="thing-container">
    <table class="table-striped">
        <tbody>
            {#each $userData.characters as character}
                <tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
                    <TableCharacterName {character} />
                    <TableItemLevel {character} />
                    <td class="spacer"></td>
                    {#each slotOrder as inventorySlot}
                        <GearItem {character} {inventorySlot} />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
