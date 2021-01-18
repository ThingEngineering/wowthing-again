<script lang="ts">
    import {orderShadowlands, seasonDungeonOrder} from '../../data/dungeon'
    import {data as userData} from '../../stores/user-store'
    import type {Character} from '../../types'

    import MythicPlusDungeon from './MythicPlusDungeon.svelte'
    import MythicPlusTableRow from './MythicPlusTableRow.svelte'
    import TableCharacterNameHead from '../common/TableCharacterNameHead.svelte'

    export let slug: string

    let order: number[] = []
    let runsFunc = (char: Character, dungeonId: number) => []
    $: {
        if (slug === 'thisweek') {
            order = orderShadowlands
            runsFunc = (char, dungeonId) => char.mythicPlus?.periodRuns?.[dungeonId] || []
        } else {
            const season = slug.replace('season', '')
            order = seasonDungeonOrder[season]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season]?.[dungeonId]
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
    <thead>
        <tr>
            <TableCharacterNameHead />
            {#each order as dungeonId}
                <MythicPlusDungeon {dungeonId} />
            {/each}
            <th class="sigh"></th>
        </tr>
    </thead>
    <tbody>
        {#each $userData.characters as character}
            {#if character.level >= 50}
                <MythicPlusTableRow {character} {order} {runsFunc} />
            {/if}
        {/each}
    </tbody>
</table>
