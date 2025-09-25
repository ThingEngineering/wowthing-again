<script lang="ts">
    import { LookupType } from '@/enums/lookup-type';
    import { wowthingData } from '@/shared/stores/data';
    import { thingContentTypeToRewardType } from '@/shared/stores/db/types';
    import { UserCount } from '@/types';
    import getPercentClass from '@/utils/get-percent-class';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
    import { userHasLookup } from '@/utils/rewards/user-has-lookup';
    import type { SomethingThing } from './types';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import LookupThing from './LookupThing.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    let { thingData }: { thingData: SomethingThing } = $props();
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
        width: auto;
    }
    .title {
        align-content: flex-start;
        display: flex;
        padding-right: 0.5rem;
    }
</style>

<div class="collection-group">
    <div class="title">
        <h4 class="drop-shadow text-overflow {getPercentClass(thingData.stats.percent)}">
            <ParsedText text={wowthingData.items.items[thingData.thing.id]?.name} />
        </h4>
        <CollectibleCount counts={thingData.stats} />
    </div>

    <div class="collection-objects">
        {#each thingData.contents as { originalId, lookupType, lookupId, userHas }}
            <LookupThing {lookupId} {lookupType} {originalId} {userHas} />
        {/each}
    </div>
</div>
