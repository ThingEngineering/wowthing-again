<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import {seasonMap} from '../../data/dungeon'
    import type {Character, CharacterMythicPlusRun, MythicPlusSeason} from '../../types'

    import CharacterTable from '../common/character-table/Table.svelte'
    import Head from '../common/character-table/Head.svelte'
    import HeadDungeon from './TableHeadDungeon.svelte'
    import HeadItemLevel from '../common/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '../common/character-table/head/Keystone.svelte'
    import HeadMythicPlusBadge from '../common/character-table/head/MythicPlusBadge.svelte'
    import HeadRaiderIo from '../common/character-table/head/RaiderIo.svelte'
    import RowDungeon from './TableRowDungeon.svelte'
    import RowItemLevel from '../common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '../common/character-table/row/Keystone.svelte'
    import RowMythicPlusBadge from '../common/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '../common/character-table/row/RaiderIo.svelte'

    export let slug: string

    const firstSeason = sortBy(seasonMap, (s: MythicPlusSeason) => -s.Id)[0]

    let filterFunc: (char: Character) => boolean
    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    let season: MythicPlusSeason

    $: {
        if (slug === 'thisweek') {
            season = firstSeason
            runsFunc = (char, dungeonId) => char.mythicPlus?.periodRuns?.[dungeonId] || []
        } else {
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
        }

        filterFunc = (char: Character) => char.level >= season.MinLevel
    }
</script>

<CharacterTable {filterFunc} extraSpan={4 + (season.Id === firstSeason.Id ? 3 : 0)} endSpacer={false}>
    <slot slot="colgroup">
        {#each season.Orders as order}
            <colgroup span="{order.length}"></colgroup>
        {/each}
    </slot>

    <slot slot="head">
        <Head>
            <HeadItemLevel />
            {#if season.Id === firstSeason.Id}
                <HeadKeystone />
            {/if}
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
            {#if season.Id === firstSeason.Id}
                <RowKeystone />
            {/if}
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
