<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { RewardType } from '@/enums/reward-type';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { ThingData } from '@/types/vendors';
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataVendorGroup } from '@/types/data/manual';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Thing from './Thing.svelte';
    import { applyBonusIds } from '@/utils/items/apply-bonus-ids';

    type Props = {
        group: ManualDataVendorGroup;
        overrideShowCollected?: boolean;
        overrideShowUncollected?: boolean;
        showAll?: boolean;
        useV2: boolean;
    };
    let { group, overrideShowCollected, overrideShowUncollected, showAll, useV2 }: Props = $props();

    let element = $state<HTMLElement>(null);
    let intersected = $state(false);

    let percent = $derived.by(() =>
        Math.floor(((group.stats?.have ?? 0) / (group.stats?.total ?? 1)) * 100)
    );

    let useShowCollected =
        overrideShowCollected !== undefined
            ? overrideShowCollected
            : browserState.current.vendors.showCollected;
    let useShowUncollected =
        overrideShowUncollected !== undefined
            ? overrideShowUncollected
            : browserState.current.vendors.showUncollected;

    let things = $derived.by(() => {
        const ret: ThingData[] = [];
        for (const thing of showAll ? group.sells : group.sellsFiltered) {
            const bonusIds = thing.bonusIds || [];
            const thingKey = `${thing.type}|${thing.id}|${bonusIds.join(',')}`;
            const userHas = lazyState.vendors.userHas[thingKey] === true;
            if (showAll || (useShowCollected && userHas) || (useShowUncollected && !userHas)) {
                const thingData = new ThingData(thing, userHas);

                thingData.bonusIds = bonusIds;
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

                    if (bonusIds.length > 0) {
                        thingData.extraParams['bonus'] = bonusIds
                            .filter((bonusId) => bonusId < 999999)
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

                    const withBonusIds = applyBonusIds(bonusIds, {
                        itemLevel: item.itemLevel,
                        quality: thingData.quality,
                    });
                    thingData.quality = withBonusIds.quality;

                    const appearanceKeys = Object.keys(item?.appearances || {}).map((n) =>
                        parseInt(n)
                    );
                    let modifier = thing.appearanceModifier;
                    if (appearanceKeys.length === 1 || !appearanceKeys.includes(modifier)) {
                        modifier = appearanceKeys[0];
                    }

                    if (item.id === 242368) {
                        console.log({ item, withBonusIds, appearanceKeys, modifier, thingData });
                    }

                    if (group.overrideDifficulty === 14) {
                        modifier = AppearanceModifier.Normal;
                    } else if (group.overrideDifficulty === 15) {
                        modifier = AppearanceModifier.Heroic;
                    } else if (group.overrideDifficulty === 16) {
                        modifier = AppearanceModifier.Mythic;
                    } else if (group.overrideDifficulty === 17) {
                        modifier = AppearanceModifier.LookingForRaid;
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

                ret.push(thingData);
            }
        }

        return ret;
    });
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
                {#each things as thing (thing)}
                    <Thing {intersected} {thing} />
                {/each}
            </div>
        </div>
    </IntersectionObserver>
{/if}
