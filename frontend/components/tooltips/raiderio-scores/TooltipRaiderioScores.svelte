<script lang="ts">
    import { raiderIoScores, raiderIoScoreOrder } from '@/data/raider-io'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import type { Character, CharacterRaiderIoSeason } from '@/types'
    import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'

    export let character: Character
    export let scores: CharacterRaiderIoSeason
    export let tiers: StaticDataRaiderIoScoreTiers
</script>

<style lang="scss">
    .key {
        text-align: left;
    }
    .score {
        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>RaiderIO Score</h5>
    <table class="table-striped">
        <tbody>
            {#each raiderIoScoreOrder as scoreKey}
                <tr>
                    <td class="key">{raiderIoScores[scoreKey]}</td>
                    <td
                        class="score"
                        style:color={getRaiderIoColor(scores, tiers, scores[scoreKey])}
                    >{scores[scoreKey].toFixed(1)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
