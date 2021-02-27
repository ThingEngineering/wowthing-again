<script lang="ts">
    import {getContext} from 'svelte'

    import {raiderIoScores} from '../../data/raider-io'
    import {data as staticData} from '../../stores/static-store'
    import type {Character, MythicPlusSeason} from '../../types'
    import tippy from '../../utils/tippy'

    import TableIcon from './TableIcon.svelte'
    import RaiderIoIcon from '../images/RaiderIoIcon.svelte'

    const character: Character = getContext('character')

    export let season: MythicPlusSeason

    let scores = undefined
    let color: string = '#bbbbbb'
    let tooltip: object

    $: {
        scores = character.raiderIo?.[season.Id]
        if (scores !== undefined) {
            for (let i = 0; i < $staticData.RaiderIoScoreTiers.length; i++) {
                const tier = $staticData.RaiderIoScoreTiers[i]
                if (scores.all >= tier.Score) {
                    color = tier.RgbHex
                    break
                }
            }

            let scoresTable = []
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
<div class='tooltip-table'>
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
    @import '../../../scss/variables.scss';

    .score {
        padding-right: 0.5rem;
        text-align: right;
        width: $character-width-raider-io;
    }
</style>

{#if scores !== undefined && scores.all > 0}
    <TableIcon>
        <RaiderIoIcon size=20 border=1 />
    </TableIcon>
    <td class="score" style="color: {color}" use:tippy={tooltip}>{ scores.all.toFixed(1) }</td>
{:else}
    <TableIcon />
    <td></td>
{/if}
