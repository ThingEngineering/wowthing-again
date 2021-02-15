<script lang="ts">
    import type {Character, MythicPlusSeason} from '../../types'

    import TableIcon from './TableIcon.svelte'
    import RaiderIoIcon from '../images/RaiderIoIcon.svelte'

    export let character: Character
    export let season: MythicPlusSeason

    $: score = character?.raiderIo?.[season.Id]?.["all"]
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    td {
        padding-right: 0.5rem;
        text-align: right;
        width: $character-width-raider-io;
    }
</style>

{#if score !== undefined}
    <TableIcon>
        <RaiderIoIcon size=20 border=1 />
    </TableIcon>
    <td
        class:quality2={score >= 400 && score <= 799}
        class:quality3={score >= 800 && score <= 1199}
        class:quality4={score >= 1200 && score <= 1599}
    >{ score }</td>
{:else}
    <TableIcon />
    <td></td>
{/if}
