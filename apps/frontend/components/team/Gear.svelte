<script lang="ts">
    import { data as teamData } from '@/stores/team'

    //import TableCharacterName from '@/components/common/TableCharacterName.svelte'
    //import TableItemLevel from '@/components/common/TableItemLevel.svelte'
    import GearItems from '@/components/gear/GearTableRowItems.svelte'
</script>

<style lang="scss">
</style>

{#each $teamData.characters as teamCharacter}
    <tr class="faction{teamCharacter.character.faction}">
        <GearItems
            character={teamCharacter.character}
        />
    </tr>
{/each}
