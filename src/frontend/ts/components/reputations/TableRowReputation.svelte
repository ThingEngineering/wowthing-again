<script lang="ts">
    import {getContext} from 'svelte'

    import {data} from '../../stores/static-store'
    import type {
        Character,
        ReputationTier,
        StaticDataReputation,
        StaticDataReputationSet,
        StaticDataReputationTier,
    } from '../../types'
    import findReputationTier from '../../utils/find-reputation-tier'
    import tippy from '../../utils/tippy'

    const character: Character = getContext('character')

    export let reputation: StaticDataReputationSet

    let characterRep: number | undefined
    let repTier: ReputationTier
    let tooltip: object

    $: {
        if (character && reputation) {
            const repInfo = reputation.Both || (character.faction === 0 ? reputation.Alliance : reputation.Horde)
            const reputation: StaticDataReputation = $data.Reputations[repInfo.Id]
            characterRep = character.reputations[repInfo.Id]

            if (characterRep !== undefined && reputation !== undefined) {
                const tiers: StaticDataReputationTier = $data.ReputationTiers[reputation.TierId]
                repTier = findReputationTier(tiers, characterRep)
                let valueRank = repTier.MaxValue ? `${repTier.Value} / ${repTier.MaxValue} ${repTier.Name}` : repTier.Name

                tooltip = {
                    allowHTML: true,
                    content: `
<div class='wowthing-tooltip'>
    <h4>${reputation.Name}</h4>
    ${valueRank}
    ${repInfo.Note !== null ? '<p><em>' + repInfo.Note + '</em></p>' : ''}
</div>`,
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if characterRep !== undefined && tooltip !== undefined}
    <td class="reputation{repTier.Tier}" use:tippy={tooltip}>{repTier.Percent}%</td>
{:else}
    <td>&nbsp;</td>
{/if}
