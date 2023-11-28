<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'
    import { replace } from 'svelte-spa-router'

    import { Constants } from '@/data/constants'
    import { seasonMap } from '@/data/dungeon'
    import { timeStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { settingsStore } from '@/shared/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import { leftPad } from '@/utils/formatting'
    import { getWeeklyAffixes } from '@/utils/mythic-plus'
    import type { Character, CharacterMythicPlusRun, MythicPlusSeason } from '@/types'
    import type { StaticDataKeystoneAffix } from '@/shared/stores/static/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadDungeon from './MythicPlusTableHeadDungeon.svelte'
    import HeadItemLevel from '@/components/character-table/head/ItemLevel.svelte'
    import HeadKeystone from '@/components/character-table/head/Keystone.svelte'
    import HeadRaiderIo from '@/components/character-table/head/RaiderIo.svelte'
    import HeadVault from '@/components/character-table/head/Vault.svelte'
    import RowDungeon from './MythicPlusTableRowDungeon.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
    import TableFoot from './TableFoot.svelte'

    export let slug: string

    let affixes: StaticDataKeystoneAffix[]
    let isCurrentSeason: boolean
    let isThisWeek: boolean
    let season: MythicPlusSeason
    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    let sortFunc: (char: Character) => string

    $: {
        if (slug === 'this-week') {
            isThisWeek = true
            season = seasonMap[Constants.mythicPlusSeason]
            runsFunc = (char, dungeonId) => {
                const currentPeriod = userStore.getCurrentPeriodForCharacter($timeStore, char)
                const startStamp = currentPeriod.startTime.toUnixInteger()
                const endStamp = currentPeriod.endTime.toUnixInteger()

                for (const [timestamp, runs] of Object.entries(char.mythicPlusWeeks || {})) {
                    const weekStamp = parseInt(timestamp)
                    if (weekStamp > startStamp && weekStamp <= endStamp) {
                        return runs
                            .filter((run) => run.mapId === dungeonId)
                            .map((run) => ({
                                completed: '???',
                                dungeonId: run.mapId,
                                keystoneLevel: run.level,

                                affixes: [],
                                duration: 0,
                                members: [],
                                memberObjects: [],
                                timed: true,
                            }))
                    }
                }
                return []
            }
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
        }

        sortFunc = getCharacterSortFunc(
                $settingsStore,
                $staticStore,
                (char) => leftPad(
                    100000 - Math.floor(char.mythicPlusSeasonScores[season.id] || char.raiderIo?.[season.id]?.all || 0),
                    6,
                    '0'
                )
            )

        isCurrentSeason = season.id === Constants.mythicPlusSeason
        if (isCurrentSeason) {
            affixes = getWeeklyAffixes()
        }
    }

    const filterFunc = (char: Character) => {
        const meetsLevelReq = char.level >= season.minLevel
        const score = char.mythicPlusSeasonScores?.[season.id] || char.raiderIo?.[season.id]?.all || 0
        return meetsLevelReq && score > 0
    }
</script>

<style lang="scss">
    .no-characters {
        background: $horde-background;
        padding: 0.3rem 0.5rem;
        white-space: normal;
    }
</style>

<CharacterTable
    skipGrouping={!isThisWeek}
    skipIgnored={true}
    {filterFunc}
    {sortFunc}
>
    <CharacterTableHead slot="head">
        {#if isCurrentSeason}
            <HeadItemLevel />
        {/if}

        <HeadRaiderIo />

        {#if isCurrentSeason}
            <HeadKeystone {affixes} />
        {/if}

        {#if isThisWeek}
            <HeadVault vaultType={'M+'} />
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
        {#key slug}
            {#if isCurrentSeason}
                <RowItemLevel {character} />
            {/if}

            <RowRaiderIo {character} {season} />

            {#if isCurrentSeason}
                <RowKeystone {character} />
            {/if}

            {#if isThisWeek}
                <RowVaultMythicPlus {character} />
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

    <TableFoot
        slot="foot"
        extraColSpan={(isCurrentSeason ? 2 : 0) + 1 + (isThisWeek ? 1 : 0)}
        {season}
    />

    <svelte:fragment slot="emptyRow">
        <tr>
            <td class="no-characters" colspan="99">
                You have no characters with an M+ score from this season.
            </td>
        </tr>
    </svelte:fragment>
</CharacterTable>
