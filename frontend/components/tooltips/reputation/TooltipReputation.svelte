<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { toNiceNumber } from '@/utils/to-nice'
    import type {
        CharacterReputationParagon,
        StaticDataReputation,
        StaticDataReputationReputation,
        StaticDataReputationTier
    } from '@/types'

    export let characterRep: number
    export let paragon: CharacterReputationParagon
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

            if (tiers.names[i] === 'Exalted' && paragon) {
                reps[reps.length - 1].name = 'Paragon'
            }
        }

        // Apply quality colours to the bottom 5 tiers
        const start = Math.max(0, reps.length - 1)
        for (let i = start; i >= Math.max(0, start - 5); i--) {
            reps[i].cls = `reputation${start - i + 1}`
            if (reps[i].thisOne && reps[i + 1]) {
                reps[i + 1].thisOne = false
            }
        }
    }
</script>

<style lang="scss">
    .name {
        padding-left: 0.2rem;
        padding-right: 0.8rem;
        text-align: left;
    }
    .number1 {
        padding-left: 0.8rem;
        text-align: right;
    }
    .number2 {
        padding-left: 0.2rem;
        text-align: right;
    }
    .separator {
        padding: 0;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{reputation.name}</h4>
    <table class="table-striped">
        <tbody>
            {#each reps as rep}
                <tr class="{rep.cls}">
                    {#if rep.name === 'Paragon'}
                        <td class="number1">{toNiceNumber(paragon.current)}</td>
                        <td class="separator">/</td>
                        <td class="number2">{toNiceNumber(paragon.max)}</td>
                    {:else if characterRep >= rep.maxValue}
                        <td class="number1" colspan="3">✔</td>
                    {:else}
                        <td class="number1">
                            {#if rep.thisOne}
                                {toNiceNumber(characterRep - rep.minValue)}
                            {:else}
                                0
                            {/if}
                        </td>
                        <td class="separator">/</td>
                        <td class="number2">{toNiceNumber(rep.maxValue - rep.minValue)}</td>
                    {/if}
                    <td class="name">{rep.name}</td>
                </tr>
            {/each}

            {#if paragon}
                <tr>
                    <td class="number1" colspan="4">
                        <em>{paragon.received}</em> Paragon reward{paragon.received === 1 ? '' : 's'} received
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
