<script lang="ts">
    import { staticStore } from '@/stores/static'
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

    export let alt: boolean
    export let character: Character
    export let reputation: StaticDataReputationSet

    let characterRep: number | undefined
    let repInfo: StaticDataReputationReputation
    let repTier: ReputationTier

    $: {
        if (character !== undefined && reputation !== undefined) {
            repInfo = reputation.both || (character.faction === 0 ? reputation.alliance : reputation.horde)
            const dataRep: StaticDataReputation = $staticStore.data.reputations[repInfo.id]
            characterRep = character.reputations[repInfo.id]

            if (characterRep !== undefined && dataRep !== undefined) {
                const tiers: StaticDataReputationTier = $staticStore.data.reputationTiers[dataRep.tierId] || $staticStore.data.reputationTiers[0]
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
    <td class="reputation{repTier.Tier}" class:alt use:tippyComponent={{component: TooltipReputation, props: {characterRep, reputation: repInfo}}}>
        {repTier.Percent}%
    </td>
{:else}
    <td class:alt>&nbsp;</td>
{/if}
