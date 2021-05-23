<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import {seasonMap} from '../../data/dungeon'
    import type {Character, MythicPlusSeason} from '../../types'

    import CharacterTable from '../common/character-table/Table.svelte'
    import Head from '../common/character-table/Head.svelte'
    import HeadDungeon from './TableHeadDungeon.svelte'
    import HeadItemLevel from '../common/character-table/head/ItemLevel.svelte'
    import HeadMythicPlusBadge from '../common/character-table/head/MythicPlusBadge.svelte'
    import HeadRaiderIo from '../common/character-table/head/RaiderIo.svelte'
    import RowDungeon from './TableRowDungeon.svelte'
    import RowItemLevel from '../common/character-table/row/ItemLevel.svelte'
    import RowMythicPlusBadge from '../common/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '../common/character-table/row/RaiderIo.svelte'

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
        <Head>
            <HeadItemLevel />
            <HeadRaiderIo />
            <HeadMythicPlusBadge />
            {#key season.Id}
                {#each season.Orders as order}
                    {#each order as dungeonId}
                        <HeadDungeon {dungeonId} />
                    {/each}
                {/each}
            {/key}
        </Head>
    </slot>

    <slot slot="rowExtra">
        <RowItemLevel />
        {#key season.Id}
            <RowRaiderIo {season} />
            <RowMythicPlusBadge {season} />
            {#each season.Orders as order}
                {#each order as dungeonId}
                    <RowDungeon {dungeonId} {runsFunc} />
                {/each}
            {/each}
        {/key}
    </slot>
</CharacterTable>
