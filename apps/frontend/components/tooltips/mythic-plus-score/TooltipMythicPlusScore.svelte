<script lang="ts">
    import { keyTiers } from '@/data/dungeon'
    import { raiderIoScores, raiderIoScoreOrder } from '@/data/raider-io'
    import { getRunCounts } from '@/utils/dungeon'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import type { Character, CharacterRaiderIoSeason } from '@/types'
    import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'

    export let character: Character
    export let scores: CharacterRaiderIoSeason
    export let seasonId: number
    export let tiers: StaticDataRaiderIoScoreTiers

    let runCounts: number[]
    let totalRuns: number
    $: {
        runCounts = getRunCounts(character.mythicPlusAddon?.[seasonId]?.runs || [])
        totalRuns = runCounts.reduce((a, b) => a + b, 0)
    }
</script>

<style lang="scss">
    td {
        padding: 0.1rem 0.3rem;
    }
    .flex-wrapper {
        align-items: flex-start;
        gap: 0.5rem;
    }
    .tier {
        text-align: right;
    }
    .role {
        text-align: left;
    }
    .score {
        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Mythic+ Stats</h5>
    <div class="flex-wrapper">
        <table class="table-striped">
            <tbody>
                {#each raiderIoScoreOrder as scoreKey}
                    <tr>
                        <td class="role">{raiderIoScores[scoreKey]}</td>
                        <td
                            class="score"
                            style:color={getRaiderIoColor(tiers, scores[scoreKey])}
                        >{scores[scoreKey].toFixed(1)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>

        {#if totalRuns > 0}
            <table class="table-striped">
                <tbody>
                    {#each runCounts as count, countIndex}
                        <tr>
                            <td class="tier quality{Math.min(5, countIndex + 1)}">{keyTiers[countIndex]}:</td>
                            <td class="score">{count}</td>
                        </tr>
                    {/each}
                    <tr>
                        <td class="tier">Total:</td>
                        <td class="score">{totalRuns}</td>
                    </tr>
                </tbody>
            </table>
        {/if}
    </div>
</div>
