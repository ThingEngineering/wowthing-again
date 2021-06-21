<script lang="ts">
    import { getContext } from 'svelte'

    import { raiderIoScores } from '@/data/raider-io'
    import { data as staticData } from '@/stores/static'
    import type {
        Character,
        CharacterRaiderIoSeason,
        MythicPlusSeason,
        TippyProps,
    } from '@/types'
    import tippy from '@/utils/tippy'

    export let season: MythicPlusSeason

    let character: Character
    let scores: CharacterRaiderIoSeason | undefined
    let color = '#bbbbbb'
    let tooltip: TippyProps

    $: {
        character = getContext('character')
        scores = character.raiderIo?.[season.Id]
        if (scores !== undefined) {
            for (let i = 0; i < $staticData.RaiderIoScoreTiers.length; i++) {
                const tier = $staticData.RaiderIoScoreTiers[i]
                if (scores.all >= tier.Score) {
                    color = tier.RgbHex
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
</script>

<style lang="scss">
    .score {
        color: var(--color);
        text-align: right;
        width: $character-width-raider-io;
    }
</style>

{#if scores !== undefined && scores.all > 0}
    <td class="score" style="--color: {color}" use:tippy={tooltip}
        >{scores.all.toFixed(1)}</td
    >
{:else}
    <td class="score">&nbsp;</td>
{/if}
