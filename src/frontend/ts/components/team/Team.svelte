<script lang="ts">
    import {data as teamData} from '../../stores/team-store'

    import TableCharacterName from '../common/TableCharacterName.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'
    import GearItems from '../gear/GearItems.svelte'
</script>

<style lang="scss">
    div {
        padding: 0.5rem;
    }
</style>

<div class="thing-container">
    <h2>[flag] { $teamData.name }</h2>
    <p>{ $teamData.description }</p>
    <table class="table-striped">
        <tbody>
            {#each $teamData.characters as teamCharacter}
                <tr class="faction{teamCharacter.character.faction}">
                    <TableCharacterName character={teamCharacter.character} />
                    <TableItemLevel character={teamCharacter.character} />
                    <GearItems character={teamCharacter.character} />
                </tr>
            {/each}
        </tbody>
    </table>
</div>
