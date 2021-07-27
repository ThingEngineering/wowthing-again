<script lang="ts">
    import { getContext } from 'svelte'

    import { data } from '@/stores/static'
    import type {
        Character,
        ReputationTier,
        StaticDataReputation,
        StaticDataReputationReputation,
        StaticDataReputationSet,
        StaticDataReputationTier,
    } from '@/types'
    import findReputationTier from '@/utils/find-reputation-tier'
    import {tippyComponent} from '@/utils/tippy'

    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte'

    const character: Character = getContext('character')

    export let reputation: StaticDataReputationSet

    let characterRep: number | undefined
    let repInfo: StaticDataReputationReputation
    let repTier: ReputationTier

    $: {
        if (character !== undefined && reputation !== undefined) {
            repInfo = reputation.both || (character.faction === 0 ? reputation.alliance : reputation.horde)
            const dataRep: StaticDataReputation = $data.reputations[repInfo.id]
            characterRep = character.reputations[repInfo.id]

            if (characterRep !== undefined && dataRep !== undefined) {
                const tiers: StaticDataReputationTier = $data.reputationTiers[dataRep.tierId] || $data.reputationTiers[0]
                repTier = findReputationTier(tiers, characterRep)
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

{#if characterRep !== undefined}
    <td class="reputation{repTier.Tier}" use:tippyComponent={{component: TooltipReputation, props: {characterRep, reputation: repInfo}}}>
        {repTier.Percent}%
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
