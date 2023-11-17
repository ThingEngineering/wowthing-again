<script lang="ts">
    import flatten from 'lodash/flatten'

    import { dungeonMap, keyTiers, seasonMap } from '@/data/dungeon'
    import { raiderIoScores, raiderIoScoreOrder } from '@/data/raider-io'
    import { timeStore, userStore } from '@/stores'
    import { getRunCounts } from '@/utils/dungeon'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import { getRunQualityAffix } from '@/utils/mythic-plus'
    import type { Character, CharacterMythicPlusAddonRun, CharacterRaiderIoSeason } from '@/types'
    import type { UserDataRaiderIoScoreTiers } from '@/types/user-data'

    export let character: Character
    export let scores: CharacterRaiderIoSeason
    export let seasonId: number
    export let tiers: UserDataRaiderIoScoreTiers

    let dungeonIds: number[]
    let runCounts: number[]
    let scoreCount: number
    let totalRuns: number
    $: {
        dungeonIds = flatten(seasonMap[seasonId].orders)

        const startStamp = userStore.getPeriodForCharacter($timeStore, character, seasonMap[seasonId].startPeriod)
            .startTime
            .toUnixInteger()

        const endStamp = userStore.getCurrentPeriodForCharacter($timeStore, character)
            .endTime
            .toUnixInteger()

        runCounts = []
        const allRuns: CharacterMythicPlusAddonRun[] = []
        for (const [timestamp, weekRuns] of Object.entries(character.mythicPlusWeeks || {})) {
            const weekStamp = parseInt(timestamp)
            if (weekStamp > startStamp && weekStamp <= endStamp) {
                // data before this season is wonky, deduplicate it :(
                if (seasonId < 10) {
                    const dedupe = new Set<string>()
                    for (const run of weekRuns) {
                        const runKey = `${run.mapId}-${run.level}-${run.score}-${run.completed ? 1 : 0}`
                        if (!dedupe.has(runKey)) {
                            dedupe.add(runKey)
                            allRuns.push(run)
                        }
                    }
                }
                else {
                    allRuns.push(...weekRuns)
                }
            }
        }

        runCounts = getRunCounts(allRuns)
        totalRuns = runCounts.reduce((a, b) => a + b, 0)

        scoreCount = Object.entries(scores || {})
            .filter(([key, score]) => !key.startsWith('spec') && score > 0)
            .length
    }
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: stretch;
        gap: 1rem;
    }
    .column1 {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
    }
    td {
        padding: 0.2rem 0.4rem;
    }
    .role {
        padding-right: 0;
        text-align: right;
        width: 3.5rem;
    }
    .score {
        text-align: right;
        width: 4rem;
    }
    .dungeon-name {
        padding-bottom: 0.1rem;
        padding-top: 0.1rem;
        text-align: right;
    }
    .dungeon-level {
        &:last-child {
            padding-right: 0.6rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Mythic+ Stats</h5>
    <div class="flex-wrapper">
        <div class="column1">
            <table class="table-striped border-bottom border-right">
                <tbody>
                    {#each raiderIoScoreOrder as scoreKey}
                        {@const score = scores?.[scoreKey] || 0}
                        {#if score > 0 && !(scoreCount === 2 && scoreKey === 'all')}
                            <tr>
                                <td class="role">{raiderIoScores[scoreKey]}</td>
                                <td
                                    class="score drop-shadow"
                                    style:color={getRaiderIoColor(tiers, score)}
                                >
                                    {score.toFixed(1)}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>

            {#if totalRuns > 0}
                <table class="table-striped run-counts border-top border-right">
                    <tbody>
                        {#each runCounts as count, countIndex}
                            <tr>
                                <td class="role quality{Math.min(5, countIndex + 1)}">
                                    {keyTiers[countIndex]}
                                </td>
                                <td class="score">{count}</td>
                            </tr>
                        {/each}
                        <tr>
                            <td class="role">Total</td>
                            <td class="score">{totalRuns}</td>
                        </tr>
                    </tbody>
                </table>
            {/if}
        </div>

        <div class="column2">
            <table class="table-striped border-left">
                <tbody>
                    {#each dungeonIds as dungeonId}
                        {@const dungeon = dungeonMap[dungeonId]}
                        {@const scores = character.mythicPlusSeasons?.[seasonId]?.[dungeonId]}
                        {@const fortified = scores?.fortifiedScore}
                        {@const tyrannical = scores?.tyrannicalScore}
                        <tr>
                            <td class="dungeon-name">
                                <code>{dungeon.abbreviation}</code>
                            </td>
                            {#each [fortified, tyrannical] as score}
                                <td class="dungeon-level">
                                    {#if score}
                                        <span class="{getRunQualityAffix(score)}">
                                            {score.level}
                                        </span>
                                    {:else}
                                        <span class="quality0">---</span>
                                    {/if}
                                </td>
                            {/each}
                            <td class="dungeon-level">
                                {scores?.overallScore || 0}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
