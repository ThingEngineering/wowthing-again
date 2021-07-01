<script lang="ts">
    import { getContext } from 'svelte'

    import { data } from '@/stores/static'
    import type {
        Character,
        ReputationTier,
        StaticDataReputation,
        StaticDataReputationSet,
        StaticDataReputationTier,
        TippyProps,
    } from '@/types'
    import findReputationTier from '@/utils/find-reputation-tier'
    import tippy from '@/utils/tippy'

    const character: Character = getContext('character')

    export let reputation: StaticDataReputationSet

    let characterRep: number | undefined
    let repTier: ReputationTier
    let tooltip: TippyProps

    $: {
        if (character !== undefined && reputation !== undefined) {
            const repInfo =
                reputation.both ||
                (character.faction === 0
                    ? reputation.alliance
                    : reputation.horde)
            const dataRep: StaticDataReputation = $data.reputations[repInfo.id]
            characterRep = character.reputations[repInfo.id]

            if (characterRep !== undefined && dataRep !== undefined) {
                const tiers: StaticDataReputationTier = $data.reputationTiers[dataRep.tierId] ?? $data.reputationTiers[0]
                repTier = findReputationTier(tiers, characterRep)
                const valueRank = repTier.MaxValue
                    ? `${repTier.Value} / ${repTier.MaxValue} ${repTier.Name}`
                    : repTier.Name

                tooltip = {
                    allowHTML: true,
                    content: `
<div class='wowthing-tooltip'>
    <h4>${dataRep.name}</h4>
    ${valueRank}
    ${repInfo.note !== null ? '<p><em>' + repInfo.note + '</em></p>' : ''}
</div>`,
                }
            }
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if characterRep !== undefined && tooltip !== undefined}
    <td class="reputation{repTier.Tier}" use:tippy={tooltip}
        >{repTier.Percent}%</td
    >
{:else}
    <td>&nbsp;</td>
{/if}
