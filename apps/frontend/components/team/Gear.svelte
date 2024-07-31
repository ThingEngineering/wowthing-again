<script lang="ts">
    import { teamData } from '@/stores/team'

    //import TableCharacterName from '@/components/common/TableCharacterName.svelte'
    //import TableItemLevel from '@/components/common/TableItemLevel.svelte'
    import GearItems from '@/components/items/ItemsTableRowItems.svelte'
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
