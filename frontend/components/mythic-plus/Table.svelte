<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { seasonMap } from '@/data/dungeon'
    import type {
        Character,
        CharacterMythicPlusRun,
        MythicPlusSeason,
    } from '@/types'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import Head from '@/components/character-table/Head.svelte'
    import HeadDungeon from './TableHeadDungeon.svelte'
    import HeadItemLevel from '@/components/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '@/components/character-table/head/Keystone.svelte'
    import HeadRaiderIo from '@/components/character-table/head/RaiderIo.svelte'
    import HeadVault from '@/components/character-table/head/Vault.svelte'
    import RowDungeon from './TableRowDungeon.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMythicPlusBadge from '@/components/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'

    export let slug: string

    const firstSeason: MythicPlusSeason = sortBy(seasonMap, (s: MythicPlusSeason) => -s.Id)[0]

    let isCurrentSeason: boolean
    let isThisWeek: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => number
    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    let season: MythicPlusSeason

    $: {
        if (slug === 'thisweek') {
            isThisWeek = true
            season = firstSeason
            runsFunc = (char, dungeonId) => char.mythicPlus?.periodRuns?.[dungeonId] || []
        }
        else {
            isThisWeek = false
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
            sortFunc = (char) => -(char.raiderIo?.[season.Id]?.all ?? 0)
        }

        isCurrentSeason = season.Id === firstSeason.Id

        filterFunc = (char: Character) => char.level >= season.MinLevel
    }
</script>

<CharacterTable
    {filterFunc}
    {sortFunc}
    endSpacer={false}
    extraSpan={1}
    let:character
>
    <slot slot="head">
        <Head>
            <HeadItemLevel />

            {#if isCurrentSeason}
                <HeadKeystone />
            {/if}

            {#if isThisWeek}
                <HeadVault vaultType={'M+'} />
            {:else}
                <HeadRaiderIo />
            {/if}

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
        {#key slug}
            {#if isCurrentSeason}
                <RowKeystone />
            {/if}

            {#if isThisWeek}
                <RowVaultMythicPlus {character} />
            {:else}
                <RowRaiderIo {season} />
                <RowMythicPlusBadge {season} />
            {/if}

            {#each season.Orders as order}
                {#each order as dungeonId}
                    <RowDungeon {dungeonId} {runsFunc} />
                {/each}
            {/each}
        {/key}
    </slot>
</CharacterTable>
