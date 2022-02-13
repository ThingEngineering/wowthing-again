<script lang="ts">
    import { seasonMap } from '@/data/dungeon'
    import { raiderIoScores } from '@/data/raider-io'
    import { staticStore } from '@/stores/static'
    import tippy from '@/utils/tippy'
    import type { Character, CharacterRaiderIoSeason, MythicPlusSeason, TippyProps } from '@/types'
    import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'

    export let character: Character
    export let season: MythicPlusSeason = null
    export let seasonId = 0

    let scores: CharacterRaiderIoSeason | undefined
    let color = '#bbbbbb'
    let tooltip: TippyProps

    $: {
        if (seasonId > 0) {
            season = seasonMap[seasonId]
        }
        if (season !== null) {
            scores = character.raiderIo?.[season.id]
            const tiers: StaticDataRaiderIoScoreTiers = $staticStore.data.raiderIoScoreTiers[season.id]
            if (scores !== undefined && tiers !== undefined) {
                for (let i = 0; i < tiers.score.length; i++) {
                    if (scores.all >= tiers.score[i]) {
                        color = tiers.rgbHex[i]
                        break
                    }
                }

                const scoresTable = []
                for (const k in raiderIoScores) {
                    scoresTable.push(`
<tr>
    <td style="text-align: left">${raiderIoScores[k]}</td>
    <td style="text-align: right">${scores[k].toFixed(1)}</td>
</tr>`)
                }

                tooltip = {
                    allowHTML: true,
                    content: `
<div class='wowthing-tooltip'>
    <h4>RaiderIO Scores</h4>
    <table width="100%">
        ${scoresTable.join('')}
    </table>
</div>`,
                }
            }
        }
    }
</script>

<style lang="scss">
    .score {
        @include cell-width($width-raider-io);

        border-left: 1px solid $border-color;
        color: var(--color);
        text-align: right;
    }
</style>

{#if scores !== undefined && scores.all > 0}
    <td class="score" style="--color: {color}" use:tippy={tooltip}
        >{scores.all.toFixed(1)}</td
    >
{:else}
    <td class="score">&nbsp;</td>
{/if}
