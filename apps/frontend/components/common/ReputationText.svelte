<script lang="ts">
    import { staticStore } from '@/shared/stores/static'
    import findReputationTier from '@/utils/find-reputation-tier'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character, ReputationTier } from '@/types'
    import type { StaticDataReputationTier } from '@/shared/stores/static/types'

    export let character: Character
    export let reputationId: number

    let tier: ReputationTier
    $: {
        const have = character.reputations?.[reputationId] ?? 0
        const reputation = $staticStore.reputations[reputationId]
        const tiers: StaticDataReputationTier = $staticStore.reputationTiers[reputation.tierId] || $staticStore.reputationTiers[0]
        tier = findReputationTier(tiers, have)
    }
</script>

<style type="scss">
    span {
        display: block;
        font-size: 0.95rem;
        text-align: center;
        word-spacing: -0.1ch;
    }
</style>

<span
    class={`reputation${tier.tier}`}
>{toNiceNumber(tier.value)} / {toNiceNumber(tier.maxValue)}</span>
