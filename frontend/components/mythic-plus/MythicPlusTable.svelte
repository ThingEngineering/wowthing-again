<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'

    import { seasonMap, weeklyAffixes } from '@/data/dungeon'
    import { userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import type { Character, CharacterMythicPlusRun, MythicPlusAffix, MythicPlusSeason } from '@/types'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import getCurrentPeriodForCharacter from '@/utils/get-current-period-for-character'
    import toDigits from '@/utils/to-digits'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadDungeon from './MythicPlusTableHeadDungeon.svelte'
    import HeadItemLevel from '@/components/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '@/components/character-table/head/Keystone.svelte'
    import HeadRaiderIo from '@/components/character-table/head/RaiderIo.svelte'
    import HeadUpgrade from './MythicPlusTableHeadUpgrade.svelte'
    import HeadVault from '@/components/character-table/head/Vault.svelte'
    import RowDungeon from './MythicPlusTableRowDungeon.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMythicPlusBadge from '@/components/character-table/row/MythicPlusBadge.svelte'
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte'
    import RowUpgrade from './MythicPlusTableRowUpgrade.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'

    export let slug: string

    const firstSeason: MythicPlusSeason = sortBy(seasonMap, (s: MythicPlusSeason) => -s.id)[0]

    let affixes: MythicPlusAffix[]
    let isCurrentSeason: boolean
    let isThisWeek: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => string
    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    let season: MythicPlusSeason

    $: {
        if (slug === 'this-week') {
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
            sortFunc = getCharacterSortFunc($settingsData)
        }
        else {
            isThisWeek = false
            season = find(seasonMap, (season) => season.slug === slug)
            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.id]?.[dungeonId]
            sortFunc = (char) => toDigits(100000 - (char.raiderIo?.[season.id]?.all ?? 0), 6)
        }

        isCurrentSeason = season.id === firstSeason.id
        if (isCurrentSeason) {
            const week = ($userStore.data.currentPeriod[1].id - 809) % weeklyAffixes.length
            affixes = weeklyAffixes[week]
        }

        filterFunc = (char: Character) => char.level >= season.minLevel
    }
</script>

<CharacterTable {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        <HeadItemLevel />

        {#if isCurrentSeason}
            <HeadKeystone {affixes} />
        {/if}

        {#if isThisWeek}
            <HeadVault vaultType={'M+'} />
        {:else}
            <HeadRaiderIo />
        {/if}

        {#if isCurrentSeason && !isThisWeek}
            <HeadUpgrade />
        {/if}

        {#key season.id}
            {#each season.orders as order}
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
            {/if}

            {#if isCurrentSeason && !isThisWeek}
                <RowUpgrade {character} {season} />
            {/if}

            {#each season.orders as order}
                {#each order as dungeonId}
                    <RowDungeon {dungeonId} {runsFunc} seasonId={isThisWeek ? 0 : season.id} />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
