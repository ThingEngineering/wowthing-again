<script lang="ts">
    import flatten from 'lodash/flatten'

    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import ReputationTableCell from './ReputationTableCell.svelte'

    export let category
    export let character
</script>

<style lang="scss">
    .realm {
        padding: 0 1rem;
    }
</style>

<tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
    <td>
        <RaceIcon character={character} size={20} />
        <ClassIcon character={character} size={20} />
        {character.name}
    </td>
    <td class="realm">&ndash; {character.getRealmName()}</td>
    {#key category.Name}
        {#each flatten(category.Reputations) as reputation}
            <ReputationTableCell character={character} reputationSet={reputation} />
        {/each}
    {/key}
</tr>
