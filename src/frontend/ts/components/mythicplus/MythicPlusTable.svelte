<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import {seasonMap} from '../../data/dungeon'
    import type {Character, MythicPlusSeason} from '../../types'

    import MythicPlusDungeon from './MythicPlusDungeon.svelte'
    import MythicPlusTableCell from './MythicPlusTableCell.svelte'
    import CharacterRowItemLevel from '../common/CharacterRowItemLevel.svelte'
    import CharacterRowMythicPlusSeasonBadge from '../common/CharacterRowMythicPlusSeasonBadge.svelte'
    import CharacterRowRaiderIo from '../common/CharacterRowRaiderIo.svelte'
    import CharacterTable from '../common/CharacterTable.svelte'
    import CharacterTableHead from '../common/CharacterTableHead.svelte'
    import CharacterTableHeadItemLevel from '../common/CharacterTableHeadItemLevel.svelte'
    import CharacterTableHeadRaiderIo from '../common/CharacterTableHeadRaiderIo.svelte'
    import TableIcon from '../common/TableIcon.svelte'
    import CharacterHeadMythicPlusSeasonBadge from '../common/CharacterHeadMythicPlusSeasonBadge.svelte'

    export let slug: string

    let filterFunc: (char: Character) => boolean = undefined
    let runsFunc = (char: Character, dungeonId: number) => []
    let season: MythicPlusSeason

    $: {
        if (slug === 'thisweek') {
            season = sortBy(seasonMap, (s) => -s.Id)[0]
            runsFunc = (char, dungeonId) => char.mythicPlus?.periodRuns?.[dungeonId] || []
        } else {
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
        }

        filterFunc = (char: Character) => char.level >= season.MinLevel
    }
</script>

<CharacterTable {filterFunc} extraSpan=4 endSpacer=false>
    <slot slot="colgroup">
        {#each season.Orders as order}
            <colgroup span="{order.length}"></colgroup>
        {/each}
    </slot>

    <slot slot="head">
        <CharacterTableHead>
            <CharacterTableHeadItemLevel />
            <CharacterTableHeadRaiderIo />
            <CharacterHeadMythicPlusSeasonBadge />
            {#key season.Id}
                {#each season.Orders as order}
                    {#each order as dungeonId}
                        <MythicPlusDungeon {dungeonId} />
                    {/each}
                {/each}
            {/key}
        </CharacterTableHead>
    </slot>

    <slot slot="rowExtra">
        <CharacterRowItemLevel />
        {#key season.Id}
            <CharacterRowRaiderIo {season} />
            <CharacterRowMythicPlusSeasonBadge {season} />
            {#each season.Orders as order}
                {#each order as dungeonId}
                    <MythicPlusTableCell {dungeonId} {runsFunc} />
                {/each}
            {/each}
        {/key}
    </slot>
</CharacterTable>
