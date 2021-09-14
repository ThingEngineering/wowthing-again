<script lang="ts">
    import { staticStore } from '@/stores/static'
    import {toNiceNumber} from '@/utils/to-nice'

    import type {StaticDataReputation, StaticDataReputationReputation, StaticDataReputationTier} from '@/types'

    export let characterRep: number
    export let reputation: StaticDataReputationReputation

    const reps: {
        cls: string
        maxValue: number
        minValue: number
        name: string
        thisOne: boolean
    }[] = []

    $: {
        const dataRep: StaticDataReputation = $staticStore.data.reputations[reputation.id]
        const tiers: StaticDataReputationTier = $staticStore.data.reputationTiers[dataRep.tierId] || $staticStore.data.reputationTiers[0]

        for (let i = 0; i < tiers.names.length; i++) {
            const thisOne = (characterRep >= tiers.minValues[i] && characterRep < tiers.maxValues[i])
            reps.push({
                cls: 'quality0',
                maxValue: tiers.maxValues[i],
                minValue: tiers.minValues[i],
                name: tiers.names[i],
                thisOne,
            })
        }
        //reps.reverse()

        // Apply quality colours to the bottom 5 tiers
        const start = Math.max(0, reps.length - 1)
        for (let i = start; i > Math.max(0, start - 5); i--) {
            reps[i].cls = `reputation${start - i + 1}`
            if (reps[i].thisOne && reps[i + 1]) {
                reps[i + 1].thisOne = false
            }
        }
    }
</script>

<div class="wowthing-tooltip">
    <h4>{reputation.name}</h4>
    <table class="tooltip-reputation table-striped">
        <tbody>
            {#each reps as rep}
                <tr class="{rep.cls}">
                    {#if characterRep >= rep.maxValue}
                        <td class="rep-number1" colspan="3">✔</td>
                    {:else}
                        <td class="rep-number1">
                            {#if rep.thisOne}
                                {toNiceNumber(characterRep - rep.minValue)}
                            {:else}
                                0
                            {/if}
                        </td>
                        <td class="rep-separator">/</td>
                        <td class="rep-number2">{toNiceNumber(rep.maxValue - rep.minValue)}</td>
                    {/if}
                    <td class="rep-name">{rep.name}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
