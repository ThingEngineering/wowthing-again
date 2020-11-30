<script lang="ts">
    import flatten from 'lodash/flatten'

    import getRealmName from '../../utils/get-realm-name'

    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import ReputationTableCell from './ReputationTableCell.svelte'

    export let category
    export let character
</script>

<style lang="scss">
    .name {
        padding: 0 0 0 0.3rem;
        white-space: nowrap;
    }
    .realm {
        padding: 0 1rem;
        white-space: nowrap;
    }
</style>

<tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
    <td class="name">
        <RaceIcon character={character} size={20} />
        <ClassIcon character={character} size={20} />
        {character.name}
    </td>
    <td class="realm">&ndash; {getRealmName(character.realmId)}</td>
    {#key category.Name}
        {#each flatten(category.Reputations) as reputation}
            <ReputationTableCell character={character} reputationSet={reputation} />
        {/each}
    {/key}
</tr>
