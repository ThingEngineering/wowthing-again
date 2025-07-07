<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { weaponSubclassOrderMap } from '@/data/weapons';
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { Faction } from '@/enums/faction';
    import { ItemClass } from '@/enums/item-class';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { inventoryTypeIcons, weaponSubclassIcons } from '@/shared/icons/mappings';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { UserCount } from '@/types';
    import { userState } from '@/user-home/state/user';
    import { fixedInventoryType } from '@/utils/fixed-inventory-type';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { ItemDataItem } from '@/types/data/item';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';

    let { itemIdAndModifier }: { itemIdAndModifier: string } = $props();

    let element = $state<HTMLElement>(null);
    let intersected = $state(false);

    let [itemId, baseModifier, bonusIds] = $derived.by(() => {
        const parts = itemIdAndModifier.split('|');
        return [parseInt(parts[0]), parseInt(parts[1]), parts[2].replaceAll(',', ':')];
    });
    let item = $derived(wowthingData.items.items[itemId]);
    let expandsTo = $derived(wowthingData.journal.itemExpansion[itemId]);
    let haveItems = $derived(userState.general.itemsById[itemId]);
    let haveCount = $derived(haveItems.reduce((a, b) => a + b[1].length, 0));

    let expandsData: [number, ItemDataItem, boolean, AppearanceModifier][] = $derived.by(() =>
        expandsTo.map((expandedItemId) => {
            const expandedItem = wowthingData.items.items[expandedItemId];

            let modifier = baseModifier || AppearanceModifier.Normal;
            if (item.difficultyLookingForRaid) {
                modifier = AppearanceModifier.LookingForRaid;
            } else if (item.difficultyHeroic) {
                modifier = AppearanceModifier.Heroic;
            } else if (item.difficultyMythic) {
                modifier = AppearanceModifier.Mythic;
            }

            const appearance = expandedItem.appearances[modifier];
            let hasItem = false;
            if (appearance) {
                hasItem = settingsState.value.transmog.completionistMode
                    ? userState.general.hasAppearanceBySource.has(
                          expandedItemId * 1000 + appearance.modifier
                      )
                    : userState.general.hasAppearanceById.has(appearance.appearanceId);
            }

            return [expandedItemId, expandedItem, hasItem, modifier];
        })
    );
    let modifier = $derived((expandsData || [])[0]?.[3] || AppearanceModifier.Normal);
    let showItemIcon = $derived.by(() =>
        expandsData.every(([, item]) => item.classId === ItemClass.Weapon)
    );

    $effect(() => {
        if (showItemIcon) {
            expandsData.sort(
                (a, b) =>
                    (weaponSubclassOrderMap[a[1]?.subclassId] ?? 999) -
                    (weaponSubclassOrderMap[b[1]?.subclassId] ?? 999)
            );
        }
    });

    function playableClassFromMask(classMask: number) {
        return classMask in PlayableClassMask
            ? PlayableClass[PlayableClassMask[classMask] as keyof typeof PlayableClass]
            : 0;
    }

    function getSpecIds(itemId: number): number[] {
        if (showItemIcon) {
            const specIds: number[] = [];
            const item = wowthingData.items.items[itemId];
            if (item?.classMask > 0) {
                for (const playableClass of getClassesFromMask(item.classMask)) {
                    const characterClass =
                        wowthingData.static.characterClassById.get(playableClass);
                    specIds.push(...characterClass.specializationIds);
                }
            }
            return specIds;
        } else {
            return wowthingData.items.specOverrides[itemId];
        }
    }
</script>

<style lang="scss">
    h4 {
        --image-margin-top: -2px;

        display: flex;
        justify-content: space-between;
        padding-right: 0.2rem;
    }
    .item-name {
        align-items: center;
        display: flex;
        gap: 0.2rem;
    }
    .collection-v2-group {
        width: calc((52px * 7) + (0.3rem * 6));
    }
    .collection-object {
        height: 52px;
        width: 52px;

        :global(a > *) {
            z-index: 5;
        }
    }
    .slot {
        background: rgba(0, 0, 0, 0.8);
        color: #ddd;
        left: 0px;
        pointer-events: none;
        position: absolute;
        top: 0px;
        transform: scale(0.75);
    }
    .specializations {
        --image-border-width: 1px;

        bottom: 2px;
        display: flex;
        gap: 2px;
        justify-content: center;
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
        width: 100%;

        > span {
            border: 2px solid rgba(0, 0, 0, 0.8);
            border-radius: var(--border-radius);
        }
    }
    .pill {
        // font-size: 90%;
        font-variant: small-caps;
    }
    .faction {
        --image-margin-top: 0;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <div class="collection-v2-group" bind:this={element}>
        <h4 class="text-overflow">
            <span class="item-name">
                {haveCount}x

                {#if modifier === AppearanceModifier.LookingForRaid}
                    <code>[L]</code>
                {:else if modifier === AppearanceModifier.Heroic}
                    <code>[H]</code>
                {:else if modifier === AppearanceModifier.Mythic}
                    <code>[M]</code>
                {:else}
                    <code>[N]</code>
                {/if}

                {#if item.allianceOnly || item.hordeOnly}
                    <span class="faction">
                        <FactionIcon
                            faction={item.allianceOnly ? Faction.Alliance : Faction.Horde}
                        />
                    </span>
                {/if}

                <WowheadLink
                    id={itemId}
                    type="item"
                    extraClass="quality{item.quality}"
                    extraParams={{ bonus: bonusIds }}
                >
                    <WowthingImage name="item/{itemId}" size={20} />
                    {item.name}
                </WowheadLink>
            </span>

            <CollectibleCount
                counts={new UserCount(
                    expandsData.reduce((a, b) => a + (b[2] ? 1 : 0), 0),
                    expandsTo.length
                )}
            />
        </h4>

        <div class="collection-objects">
            {#each expandsData as [expandedItemId, expandedItem, hasItem]}
                {@const classId = playableClassFromMask(expandedItem.classMask)}
                {@const specIds = getSpecIds(expandedItemId)}
                {#if (browserState.current.tokens.showCollected && hasItem) || (browserState.current.tokens.showUncollected && !hasItem)}
                    <div
                        class="collection-object {classId ? `class-${classId}` : ''}"
                        class:missing={(!browserState.current.tokens.highlightMissing &&
                            !hasItem) ||
                            (browserState.current.tokens.highlightMissing && hasItem)}
                    >
                        {#if intersected}
                            <WowheadLink id={expandedItemId} type="item">
                                <span class="slot">
                                    <IconifyIcon
                                        dropShadow={true}
                                        icon={showItemIcon
                                            ? weaponSubclassIcons[expandedItem?.subclassId]
                                            : inventoryTypeIcons[
                                                  fixedInventoryType(expandedItem?.inventoryType)
                                              ]}
                                    />
                                </span>

                                {#if hasItem}
                                    <CollectedIcon />
                                {/if}

                                {#if showItemIcon}
                                    <WowthingImage
                                        name={`item/${expandedItemId}`}
                                        size={48}
                                        border={2}
                                    />
                                {:else if classId}
                                    <ClassIcon {classId} size={48} border={2} />
                                {:else}
                                    <WowthingImage name="/invalid" size={48} border={2} />
                                {/if}

                                {#if classId && !showItemIcon}
                                    <span class="specializations">
                                        {#if specIds?.length > 0 && specIds.length < 3}
                                            {#each specIds as specId}
                                                <span style="line-height: 1;">
                                                    <SpecializationIcon {specId} size={20} />
                                                </span>
                                            {/each}
                                        {:else}
                                            <span class="pill">All</span>
                                        {/if}
                                    </span>
                                {/if}
                            </WowheadLink>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</IntersectionObserver>
