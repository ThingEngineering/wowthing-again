<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'
    import { replace } from 'svelte-spa-router'

    import { Constants } from '@/data/constants'
    import { seasonMap, weeklyAffixes } from '@/data/dungeon'
    import { staticStore, userStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import type { Character, CharacterMythicPlusRun, MythicPlusAffix, MythicPlusSeason } from '@/types'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import getCurrentPeriodForCharacter from '@/utils/get-current-period-for-character'
    import leftPad from '@/utils/left-pad'

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
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte'
    import RowUpgrade from './MythicPlusTableRowUpgrade.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'

    export let slug: string

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
            season = seasonMap[Constants.mythicPlusSeason]
            runsFunc = (char, dungeonId) => {
                const currentPeriod = getCurrentPeriodForCharacter(char)
                if (currentPeriod && char.mythicPlus?.currentPeriodId === currentPeriod.id) {
                    return char.mythicPlus?.periodRuns?.[dungeonId] || []
                } else {
                    return []
                }
            }
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        }
        else {
            isThisWeek = false
            season = find(seasonMap, (season) => season.slug === slug)
            if (season === undefined) {
                season = sortBy(
                    Object.values(seasonMap),
                    (season) => -season.id
                )[0]
                replace(`/mythic-plus/${season.slug}`)
                break $
            }

            runsFunc = (char, dungeonId) => char.mythicPlus?.seasons?.[season.id]?.[dungeonId]
            sortFunc = getCharacterSortFunc(
                $settingsStore,
                $staticStore,
                (char) => leftPad(
                    100000 - Math.floor(char.mythicPlusSeasonScores[season.id] || char.raiderIo?.[season.id]?.all || 0),
                    6,
                    '0'
                )
            )
        }

        isCurrentSeason = season.id === Constants.mythicPlusSeason
        if (isCurrentSeason) {
            const week = ($userStore.currentPeriod[1].id - 809) % weeklyAffixes.length
            affixes = weeklyAffixes[week]
        }

        filterFunc = (char: Character) => {
            const meetsLevelReq = char.level >= season.minLevel
            if (isCurrentSeason) {
                return meetsLevelReq
            }
            else {
                const score = char.mythicPlusSeasonScores?.[season.id] || char.raiderIo?.[season.id]?.all || 0
                return meetsLevelReq && score > 0
            }
        }
    }
</script>

<CharacterTable
    skipGrouping={slug !== 'this-week'}
    skipIgnored={true}
    {filterFunc}
    {sortFunc}
>
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
                <RowRaiderIo {character} {season} />
            {/if}

            {#if isCurrentSeason && !isThisWeek}
                <RowUpgrade {character} {season} />
            {/if}

            {#each season.orders as order}
                {#each order as dungeonId}
                    <RowDungeon
                        seasonId={isThisWeek ? 0 : season.id}
                        {dungeonId}
                        {runsFunc}
                    />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>

    <svelte:fragment slot="emptyRow">
        <tr>
            <td class="no-characters" colspan="99">
                You have no characters with an M+ score from this season.
            </td>
        </tr>
    </svelte:fragment>
</CharacterTable>

<style lang="scss">
    .no-characters {
        background: $horde-background;
        padding: 0.3rem 0.5rem;
        white-space: normal;
    }
</style>
