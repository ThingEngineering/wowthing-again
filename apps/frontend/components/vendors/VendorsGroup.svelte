<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { RewardType } from '@/enums/reward-type';
    import { wowthingData } from '@/shared/stores/data';
    import { vendorState } from '@/stores/local-storage';
    import { ThingData } from '@/types/vendors';
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataVendorGroup } from '@/types/data/manual';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Thing from './Thing.svelte';

    export let group: ManualDataVendorGroup;
    export let useV2: boolean;

    let element: HTMLElement;
    let intersected = false;
    let percent: number;
    let things: ThingData[];

    $: {
        things = [];
        for (const thing of group.sellsFiltered) {
            const thingKey = `${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`;
            const userHas = lazyState.vendors.userHas[thingKey] === true;
            if (
                ($vendorState.showCollected && userHas) ||
                ($vendorState.showUncollected && !userHas)
            ) {
                const thingData = new ThingData(thing, userHas);

                thingData.quality =
                    thing.quality || wowthingData.items.items[thing.id]?.quality || 0;

                if (thing.type === RewardType.Mount) {
                    thingData.linkType = 'spell';
                    thingData.linkId = wowthingData.static.mountById.get(thing.id)?.spellId;
                } else if (thing.type === RewardType.Pet) {
                    thingData.linkType = 'npc';
                    thingData.linkId = wowthingData.static.petById.get(thing.id)?.creatureId;
                } else {
                    thingData.linkType = 'item';
                    thingData.linkId = thing.id;

                    if (thing.bonusIds) {
                        thingData.extraParams['bonus'] = thing.bonusIds
                            .map((bonusId) => bonusId.toString())
                            .join(':');
                    }

                    if (thing.classMask in PlayableClassMask) {
                        thingData.classId =
                            PlayableClass[
                                PlayableClassMask[thing.classMask] as keyof typeof PlayableClass
                            ];
                    } else {
                        thingData.classId = 0;
                    }

                    const item = wowthingData.items.items[thingData.linkId];
                    const appearanceKeys = Object.keys(item?.appearances || {}).map((n) =>
                        parseInt(n)
                    );
                    let modifier = thing.appearanceModifier;
                    if (appearanceKeys.length === 1) {
                        modifier = appearanceKeys[0];
                    }

                    if (modifier === AppearanceModifier.Mythic) {
                        thingData.difficulty = 'M';
                    } else if (modifier === AppearanceModifier.Heroic) {
                        thingData.difficulty = 'H';
                    } else if (modifier === AppearanceModifier.LookingForRaid) {
                        thingData.difficulty = 'L';
                    } else if (modifier === AppearanceModifier.Normal && group.showNormalTag) {
                        thingData.difficulty = 'N';
                    }
                }

                things.push(thingData);
            }
        }

        percent = Math.floor(((group.stats?.have ?? 0) / (group.stats?.total ?? 1)) * 100);
    }
</script>

<style lang="scss">
    .collection-v2-group {
        width: 17.6rem;
    }
    .collection-objects {
        min-height: 52px;
    }
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

{#if things?.length > 0}
    <IntersectionObserver once {element} bind:intersecting={intersected}>
        <div bind:this={element} class="collection{useV2 ? '-v2' : ''}-group">
            <div class="title">
                <h4 class="drop-shadow text-overflow {getPercentClass(percent)}">
                    <ParsedText text={group.name} />
                </h4>
                <CollectibleCount counts={group.stats} />
            </div>

            <div class="collection-objects">
                {#each things as thing}
                    <Thing {intersected} {thing} />
                {/each}
            </div>
        </div>
    </IntersectionObserver>
{/if}
