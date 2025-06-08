<script lang="ts">
    import { staticStore } from '@/shared/stores/static';
    import findReputationTier from '@/utils/find-reputation-tier';
    import { wowthingData } from '@/shared/stores/data';
    import type { Character, ReputationTier } from '@/types';
    import type { StaticDataReputationTier } from '@/shared/stores/static/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';

    export let character: Character;
    export let reputationId: number;
    export let small = false;

    let tier: ReputationTier;
    $: {
        const have = character.reputations?.[reputationId] ?? 0;
        const reputation = wowthingData.static.reputationById.get(reputationId);
        const tiers: StaticDataReputationTier =
            $staticStore.reputationTiers[reputation.tierId] || $staticStore.reputationTiers[0];
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
