<script lang="ts">
    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'

    export let category
    export let character
</script>

<tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
    <td>
        <RaceIcon character={character} size={20} />
        <ClassIcon character={character} size={20} />
        {character.name}
    </td>
    <td>&mdash; {character.getRealmName()}</td>
    {#each category.Reputations as grouping}
        {#each grouping as reputation}
            <td>{reputation.Paragon}</td>
        {/each}
    {/each}
</tr>
