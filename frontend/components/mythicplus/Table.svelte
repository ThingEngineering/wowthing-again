<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { seasonMap } from '@/data/dungeon'
    import type {
        Character,
        CharacterMythicPlusRun,
        MythicPlusSeason,
    } from '@/types'

    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import Head from '@/components/common/character-table/Head.svelte'
    import HeadDungeon from './TableHeadDungeon.svelte'
    import HeadItemLevel from '@/components/common/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '@/components/common/character-table/head/Keystone.svelte'
    import HeadMythicPlusBadge from '@/components/common/character-table/head/MythicPlusBadge.svelte'
    import HeadRaiderIo from '@/components/common/character-table/head/RaiderIo.svelte'
    import RowDungeon from './TableRowDungeon.svelte'
    import RowItemLevel from '@/components/common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/common/character-table/row/Keystone.svelte'
    import RowMythicPlusBadge from '@/components/common/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '@/components/common/character-table/row/RaiderIo.svelte'

    export let slug: string

    const firstSeason = sortBy(seasonMap, (s: MythicPlusSeason) => -s.Id)[0]

    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => number
    let runsFunc: (
        char: Character,
        dungeonId: number,
    ) => CharacterMythicPlusRun[]
    let season: MythicPlusSeason

    $: {
        if (slug === 'thisweek') {
            season = firstSeason
            runsFunc = (char, dungeonId) =>
                char.mythicPlus?.periodRuns?.[dungeonId] || []
        } else {
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) =>
                char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
            sortFunc = (char) => -(char.raiderIo?.[season.Id]?.all ?? 0)
        }

        filterFunc = (char: Character) => char.level >= season.MinLevel
    }
</script>

<CharacterTable
    {filterFunc}
    {sortFunc}
    extraSpan={4 + (season.Id === firstSeason.Id ? 3 : 0)}
    endSpacer={false}
>
    <slot slot="colgroup">
        {#each season.Orders as order}
            <colgroup span={order.length} />
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
