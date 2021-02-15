<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import {seasonMap} from '../../data/dungeon'
    import {data as userData} from '../../stores/user-store'
    import type {Character} from '../../types'

    import MythicPlusDungeon from './MythicPlusDungeon.svelte'
    import MythicPlusTableRow from './MythicPlusTableRow.svelte'
    import TableCharacterNameHead from '../common/TableCharacterNameHead.svelte'
    import TableCharacterRaiderIoHead from '../common/TableCharacterRaiderIoHead.svelte'
    import type {MythicPlusSeason} from '../../types'

    export let slug: string

    let season: MythicPlusSeason
    let runsFunc = (char: Character, dungeonId: number) => []
    $: {
        if (slug === 'thisweek') {
            season = sortBy(seasonMap, (s) => -s.Id)[0]
            runsFunc = (char, dungeonId) => char.mythicPlus?.periodRuns?.[dungeonId] || []
        } else {
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
        }
    }
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    table {
        background: $thing-background;
        table-layout: fixed;
        width: 100%;

        & :global(th) {
            border-bottom: 1px solid $border-color;
            position: sticky;
            top: 0;
        }
        & :global(thead th:nth-child(-n+9)) {
            background: $body-background;
        }
        & :global(tr:last-child td:not(.sigh)) {
            border-bottom: 1px solid $border-color;
        }
        & :global(tbody td) {
            white-space: nowrap;
        }
    }
    colgroup:nth-child(even) {
        background: darken($thing-background, 3%);
    }
    .sigh {
        background: $body-background;
        border-left: 1px solid $border-color;
        border-bottom-width: 0;
        width: 100%;
    }
</style>

<table class="table-striped">
    <colgroup span="9"></colgroup>
    {#each season.Orders as order}
        <colgroup span="{order.length}"></colgroup>
    {/each}
    <thead>
        <tr>
            <TableCharacterNameHead />
            <th style="width: 3em"></th>
            <TableCharacterRaiderIoHead />
            {#key season.Id}
                {#each season.Orders as order}
                    {#each order as dungeonId}
                        <MythicPlusDungeon {dungeonId} />
                    {/each}
                {/each}
            {/key}
            <th class="sigh"></th>
        </tr>
    </thead>
    <tbody>
        {#each $userData.characters as character}
            {#if character.level >= season.MinLevel}
                <MythicPlusTableRow {character} {season} {runsFunc} />
            {/if}
        {/each}
    </tbody>
</table>
