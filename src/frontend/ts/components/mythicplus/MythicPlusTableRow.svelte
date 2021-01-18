<svelte:options immutable={true} />

<script lang="ts">
    import MythicPlusTableCell from './MythicPlusTableCell.svelte'
    import TableCharacterName from '../common/TableCharacterName.svelte'

    export let character
    export let order: number[] = []
    export let runsFunc
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    td {
        border-left: 1px solid $border-color;
    }
    .name {
        padding: 0 0 0 0.3rem;
        white-space: nowrap;
    }
    .realm {
        border-left: none;
        padding: 0 1rem;
        white-space: nowrap;
    }
    .sigh {
        background: $body-background;
        border-bottom-width: 0 !important;
    }
</style>

<tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
    <TableCharacterName {character} />
    {#each order as dungeonId}
        <MythicPlusTableCell runs={runsFunc(character, dungeonId)} />
    {/each}
    <td class="sigh"></td>
</tr>
