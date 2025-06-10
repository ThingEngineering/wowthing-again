<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import findReputationTier from '@/utils/find-reputation-tier';
    import type { StaticDataReputationTier } from '@/shared/stores/static/types';
    import type { Character, ReputationTier } from '@/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';

    export let character: Character;
    export let reputationId: number;
    export let small = false;

    let tier: ReputationTier;
    $: {
        const have = character.reputations?.[reputationId] ?? 0;
        const reputation = wowthingData.static.reputationById.get(reputationId);
        const tiers: StaticDataReputationTier =
            wowthingData.static.reputationTierById.get(reputation.tierId) ||
            wowthingData.static.reputationTierById.get(0);
        tier = findReputationTier(tiers, have);
    }
</script>

<ProgressBar
    title={small ? '' : tier.name}
    have={tier.value}
    shortText={small}
    total={tier.maxValue}
    cls={`reputation${tier.tier}`}
/>
