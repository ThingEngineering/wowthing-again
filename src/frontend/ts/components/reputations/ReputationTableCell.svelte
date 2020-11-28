<script lang="ts">
    import {data} from '../../stores/static-store'
    import {
        Character, ReputationTier,
        StaticDataReputation,
        StaticDataReputationSet,
        StaticDataReputationTier,
    } from '../../types'
    import findReputationTier from '../../utils/find-reputation-tier'
    import tippy from '../../utils/tippy'

    export let character: Character
    export let reputationSet: StaticDataReputationSet

    let characterRep: number | undefined
    let repTier: ReputationTier
    let tooltip: object

    $: if (character || reputationSet) {
        const repInfo = reputationSet.Both || (character.faction === 0 ? reputationSet.Alliance : reputationSet.Horde)
        characterRep = character.reputations[repInfo.Id]

        if (characterRep !== undefined) {
            const reputation: StaticDataReputation = $data.Reputations[repInfo.Id]
            const tiers: StaticDataReputationTier = $data.ReputationTiers[reputation.TierId]
            repTier = findReputationTier(tiers, characterRep)
            let valueRank = repTier.MaxValue ? `${repTier.Value} / ${repTier.MaxValue} ${repTier.Name}` : repTier.Name

            tooltip = {
                allowHTML: true,
                content: `<div class='tooltip-table'><h4>${reputation.Name}</h4>${valueRank}</div>`,
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

{#if characterRep !== undefined}
    <td class="reputation{repTier.Tier}" use:tippy={tooltip}>{repTier.Percent}%</td>
{:else}
    <td></td>
{/if}
