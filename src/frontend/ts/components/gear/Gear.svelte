<script lang="ts">
    import {afterUpdate} from 'svelte'

    import {data as userData} from '../../stores/user-store'

    import GearItems from './GearItems.svelte'
    import TableCharacterName from '../common/TableCharacterName.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'

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
</style>

<div class="thing-container">
    <table class="table-striped">
        <tbody>
            {#each $userData.characters as character}
                <tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
                    <TableCharacterName {character} />
                    <TableItemLevel {character} />
                    <GearItems {character} />
                </tr>
            {/each}
        </tbody>
    </table>
</div>
