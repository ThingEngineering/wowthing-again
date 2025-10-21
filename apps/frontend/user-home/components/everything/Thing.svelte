<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { DbThingType } from '@/shared/stores/db/enums';
    import getPercentClass from '@/utils/get-percent-class';
    import type { SomethingThing } from './types';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import LookupThing from './LookupThing.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { thingData }: { thingData: SomethingThing } = $props();

    let name = $derived.by(() => {
        if (thingData.thing.type === DbThingType.Item) {
            return (
                wowthingData.items.items[thingData.thing.id]?.name || `Item #${thingData.thing.id}`
            );
        } else {
            return thingData.thing.name;
        }
    });
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
            {#if thingData.thing.type === DbThingType.Item}
                <WowheadLink type="item" id={thingData.thing.id}>
                    <WowthingImage name="item/{thingData.thing.id}" size={20} border={1} />
                    <ParsedText text={name} />
                </WowheadLink>
            {:else}
                <ParsedText text={name} />
            {/if}
        </h4>
        <CollectibleCount counts={thingData.stats} />
    </div>

    <div class="collection-objects">
        {#each thingData.contents as { originalId, lookupType, lookupId, userHas }}
            <LookupThing {lookupId} {lookupType} {originalId} {userHas} />
        {/each}
    </div>
</div>
