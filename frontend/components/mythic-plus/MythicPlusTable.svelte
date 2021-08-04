<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { seasonMap } from '@/data/dungeon'
    import type { Character, CharacterMythicPlusRun, MythicPlusSeason } from '@/types'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import getCurrentPeriodForCharacter from '@/utils/get-current-period-for-character'
    import toDigits from '@/utils/to-digits'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadDungeon from './MythicPlusTableHead.svelte'
    import HeadItemLevel from '@/components/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '@/components/character-table/head/Keystone.svelte'
    import HeadRaiderIo from '@/components/character-table/head/RaiderIo.svelte'
    import HeadSpacer from '@/components/character-table/head/Spacer.svelte'
    import HeadVault from '@/components/character-table/head/Vault.svelte'
    import RowDungeon from './MythicPlusTableBody.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMythicPlusBadge from '@/components/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte'
    import RowSpacer from '@/components/character-table/row/Spacer.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'

    export let slug: string

    const firstSeason: MythicPlusSeason = sortBy(seasonMap, (s: MythicPlusSeason) => -s.Id)[0]

    let isCurrentSeason: boolean
    let isThisWeek: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => string
    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    let season: MythicPlusSeason

    $: {
        if (slug === 'thisweek') {
            isThisWeek = true
            season = firstSeason
            runsFunc = (char, dungeonId) => {
                const currentPeriod = getCurrentPeriodForCharacter(char)
                if (currentPeriod && char.mythicPlus?.currentPeriodId === currentPeriod.id) {
                    return char.mythicPlus?.periodRuns?.[dungeonId] || []
                } else {
                    return []
                }
            }
            sortFunc = getCharacterSortFunc()
        }
        else {
            isThisWeek = false
            season = seasonMap[slug.replace('season', '')]
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.Id]?.[dungeonId]
            sortFunc = (char) => toDigits(100000 - (char.raiderIo?.[season.Id]?.all ?? 0), 6)
        }

        isCurrentSeason = season.Id === firstSeason.Id

        filterFunc = (char: Character) => char.level >= season.MinLevel
    }
</script>

<CharacterTable {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
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
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <RowItemLevel />
        {#key slug}
            {#if isCurrentSeason}
                <RowKeystone {character} />
            {/if}

            {#if isThisWeek}
                <RowVaultMythicPlus {character} />
            {:else}
                <RowRaiderIo {season} />
                <RowMythicPlusBadge {season} />
            {/if}

            {#each season.Orders as order}
                {#each order as dungeonId}
                    <RowDungeon {dungeonId} {runsFunc} seasonId={isThisWeek ? 0 : season.Id} />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
