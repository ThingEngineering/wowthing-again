<svelte:options immutable={true} />

<script lang="ts">
    import MythicPlusTableCell from './MythicPlusTableCell.svelte'
    import TableCharacterName from '../common/TableCharacterName.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'
    import type {MythicPlusSeason} from '../../types'

    export let character
    export let runsFunc
    export let season: MythicPlusSeason
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    td {
        border-left: 1px solid $border-color;
    }
    .sigh {
        background: $body-background;
        border-bottom-width: 0 !important;
    }
</style>

<tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
    <TableCharacterName {character} />
    <TableItemLevel {character} />
    {#each season.Orders as order}
        {#each order as dungeonId}
            <MythicPlusTableCell runs={runsFunc(character, dungeonId)} />
        {/each}
    {/each}
    <td class="sigh"></td>
</tr>
