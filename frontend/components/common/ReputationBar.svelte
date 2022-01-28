<script lang="ts">
    import { staticStore } from '@/stores'
    import findReputationTier from '@/utils/find-reputation-tier'
    import type { Character, ReputationTier } from '@/types'
    import type { StaticDataReputationTier } from '@/types/data/static'

    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let character: Character
    export let reputationId: number

    let tier: ReputationTier
    $: {
        const have = character.reputations?.[reputationId] ?? 0
        const reputation = $staticStore.data.reputations[reputationId]
        const tiers: StaticDataReputationTier = $staticStore.data.reputationTiers[reputation.tierId] || $staticStore.data.reputationTiers[0]
        tier = findReputationTier(tiers, have)
    }
</script>

<ProgressBar
    title={tier.name}
    have={tier.value}
    total={tier.maxValue}
    cls={`reputation${tier.tier}-border`}
/>
