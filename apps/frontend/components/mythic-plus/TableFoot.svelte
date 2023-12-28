<script lang="ts">
    import { seasonMap } from '@/data/dungeon'
    import { commonColspan } from '@/shared/stores/settings'
    import { timeStore, userStore } from '@/stores'
    import { getRunDungeonStats } from '@/utils/dungeon/get-run-dungeon-stats'
    import type { CharacterMythicPlusAddonRun, MythicPlusSeason } from '@/types'

    export let extraColSpan: number
    export let isThisWeek: boolean
    export let season: MythicPlusSeason

    let minCounts: Record<number, number>
    let runCounts: Record<number, number>
    $: {
        minCounts = {}

        const allRuns: CharacterMythicPlusAddonRun[] = []
        const characters = $userStore.characters.filter((char) => char.level >= season.minLevel)
        if (season.id < 10) {
            for (const character of characters) {
                allRuns.push(...(character.mythicPlusAddon?.[season.id]?.runs || []))
            }
        }
        else {
            for (const character of characters) {
                const currentPeriod = userStore.getCurrentPeriodForCharacter($timeStore, character)
                let startStamp: number
                if (isThisWeek) {
                    startStamp = currentPeriod.startTime.toUnixInteger()
                }
                else {
                    startStamp = userStore.getPeriodForCharacter($timeStore, character, seasonMap[season.id].startPeriod)
                        .startTime
                        .toUnixInteger()
                }

                const endStamp = userStore.getCurrentPeriodForCharacter($timeStore, character)
                    .endTime
                    .toUnixInteger()

                for (const [timestamp, weekRuns] of Object.entries(character.mythicPlusWeeks || {})) {
                    const weekStamp = parseInt(timestamp)
                    if (weekStamp > startStamp && weekStamp <= endStamp) {
                        allRuns.push(...weekRuns)
                    }
                }
            }
        }
        console.log(allRuns)

        if (!isThisWeek) {
            for (const character of characters) {
                const thisSeason = character.mythicPlusSeasons?.[season.id]
                if (thisSeason) {
                    for (const [dungeonIdStr, dungeonData] of Object.entries(thisSeason)) {
                        const dungeonId = parseInt(dungeonIdStr)
                        minCounts[dungeonId] = (minCounts[dungeonId] || 0) +
                            (dungeonData.fortifiedScore ? 1 : 0) +
                            (dungeonData.tyrannicalScore ? 1 : 0)
                    }
                }
                else {
                    const sighSeason = character.mythicPlus?.seasons?.[season.id]
                    if (sighSeason) {
                        for (const [dungeonIdStr, dungeonData] of Object.entries(sighSeason)) {
                            const dungeonId = parseInt(dungeonIdStr)
                            minCounts[dungeonId] = (minCounts[dungeonId] || 0) + dungeonData.length
                        }
                    }
                }
            }
        }

        runCounts = getRunDungeonStats(allRuns)
    }
</script>

<style lang="scss">
    .hide-me {
        background: $body-background;
        border-bottom: none !important;
        border-left: none !important;
    }
    .run-count {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

<tfoot>
    <tr>
        <td class="hide-me" colspan={$commonColspan + extraColSpan}>
        </td>
        
        {#each season.orders as order}
            {#each order as dungeonId}
                <td class="run-count">
                    {Math.max(minCounts[dungeonId] || 0, runCounts[dungeonId] || 0)}
                </td>
            {/each}
        {/each}
    </tr>
</tfoot>

