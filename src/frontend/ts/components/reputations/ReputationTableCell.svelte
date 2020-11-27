<script lang="ts">
    import {data} from '../../stores/static-store'
    import {
        Character,
        StaticDataReputation,
        StaticDataReputationSet,
        StaticDataReputationTier,
    } from '../../types'
    import findReputationTier from '../../utils/find-reputation-tier'

    export let character: Character
    export let reputationSet: StaticDataReputationSet

    const repInfo = reputationSet.Both || (character.faction === 0 ? reputationSet.Alliance : reputationSet.Horde)
    const characterRep = character.reputations[repInfo.Id]

    let name: string
    let tier: number
    let value: string

    if (characterRep !== undefined) {
        const reputation: StaticDataReputation = $data.Reputations[repInfo.Id]
        const tiers: StaticDataReputationTier = $data.ReputationTiers[reputation.TierId]
        // FIXME array destructuring gives extremely bizarre errors here
        const sigh = findReputationTier(tiers, characterRep)
        name = sigh[0]
        tier = sigh[1]
        value = sigh[2]
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
<td class="reputation{tier}">{value}%</td>
{:else}
<td></td>
{/if}
