<script lang="ts">
    import {data as teamData} from '../../stores/team-store'

    //import TableCharacterName from '../common/TableCharacterName.svelte'
    //import TableItemLevel from '../common/TableItemLevel.svelte'
    import GearItems from '../gear/GearItems.svelte'
</script>

<style lang="scss">
</style>

{#each $teamData.characters as teamCharacter}
    <tr class="faction{teamCharacter.character.faction}">
        <GearItems character={teamCharacter.character} />
    </tr>
{/each}
