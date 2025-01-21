<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { weaponSubclassOrderMap } from '@/data/weapons';
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { inventoryTypeIcons, weaponSubclassIcons } from '@/shared/icons/mappings';
    import { browserStore } from '@/shared/stores/browser';
    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import { itemStore, journalStore, userStore } from '@/stores';
    import { UserCount } from '@/types';
    import { fixedInventoryType } from '@/utils/fixed-inventory-type';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { ItemDataItem } from '@/types/data/item';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import { Faction } from '@/enums/faction';

    export let itemId: number

    let element: HTMLElement
    let intersected = false

    $: item = $itemStore.items[itemId];
    $: expandsTo = $journalStore.itemExpansion[itemId];
    $: haveItems = $userStore.itemsById[itemId];
    $: haveCount = haveItems.reduce((a, b) => a + b[1].length, 0);

    let expandsData: [number, ItemDataItem, boolean][]
    $: expandsData = expandsTo.map((expandedItemId) => {
        const expandedItem = $itemStore.items[expandedItemId];

        let modifier = AppearanceModifier.Normal;
        if (item.difficultyLookingForRaid) {
            modifier = AppearanceModifier.LookingForRaid;
        } else if (item.difficultyHeroic) {
            modifier = AppearanceModifier.Heroic;
        } else if (item.difficultyMythic) {
            modifier = AppearanceModifier.Mythic;
        }

        const appearance = expandedItem.appearances[modifier];
        const hasItem = $settingsStore.transmog.completionistMode
            ? $userStore.hasSourceV2.get(appearance.modifier).has(expandedItemId)
            : $userStore.hasAppearance.has(appearance.appearanceId);
        return [expandedItemId, expandedItem, hasItem];
    });

    // Nathria tokens turn into a million weapons each
    $: showItemIcon = item.itemLevel === 200 || item.itemLevel === 207
    $: {
        if (showItemIcon) {
            expandsData.sort((a, b) => {
                const aOrder = weaponSubclassOrderMap[$itemStore.items[a[0]]?.subclassId] ?? 999;
                const bOrder = weaponSubclassOrderMap[$itemStore.items[b[0]]?.subclassId] ?? 999;
                return aOrder - bOrder;
            })
        }
    }

    function playableClassFromMask(classMask: number) {
        return classMask in PlayableClassMask
            ? PlayableClass[PlayableClassMask[classMask] as keyof typeof PlayableClass]
            : 0
    }

    function getSpecIds(itemId: number): number[] {
        if (showItemIcon) {
            const specIds: number[] = [];
            const item = $itemStore.items[itemId];
            if (item?.classMask > 0) {
                for (const playableClass of getClassesFromMask(item.classMask)) {
                    const characterClass = $staticStore.characterClasses[playableClass];
                    specIds.push(...characterClass.specializationIds)
                }
            }
            return specIds;
        } else {
            return $itemStore.specOverrides[itemId];
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
            border-radius: $border-radius;
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

<IntersectionObserver
    once
    {element}
    bind:intersecting={intersected}
>
    <div class="collection-v2-group" bind:this={element}>
        <h4 class="text-overflow">
            <span class="item-name">
                {haveCount}x
                
                {#if item.difficultyLookingForRaid}
                    <code>[L]</code>
                {:else if item.difficultyHeroic}
                    <code>[H]</code>
                {:else if item.difficultyMythic || item.itemLevel === 207}
                    <code>[M]</code>
                {:else}
                    <code>[N]</code>
                {/if}

                {#if item.allianceOnly || item.hordeOnly}
                    <span class="faction">
                        <FactionIcon faction={item.allianceOnly ? Faction.Alliance : Faction.Horde} />
                    </span>
                {/if}
                
                <WowheadLink id={itemId} type="item" extraClass="quality{item.quality}">
                    <WowthingImage name="item/{itemId}" size={20} />
                    {item.name}
                </WowheadLink>
            </span>

            <CollectibleCount counts={new UserCount(expandsData.reduce((a, b) => a + (b[2] ? 1 : 0), 0) , expandsTo.length)} />
        </h4>
        
        <div class="collection-objects">
            {#each expandsData as [expandedItemId, expandedItem, hasItem]}
                {@const classId = playableClassFromMask(expandedItem.classMask)}
                {@const specIds = getSpecIds(expandedItemId)}
                {#if ($browserStore.tokens.showCollected && hasItem) ||
                    ($browserStore.tokens.showUncollected && !hasItem)}
                    <div
                        class="collection-object {classId ? `class-${classId}` : ''}"
                        class:missing={
                            (!$browserStore.tokens.highlightMissing && !hasItem) ||
                            ($browserStore.tokens.highlightMissing && hasItem)
                        }
                    >
                        {#if intersected}
                            <WowheadLink id={expandedItemId} type="item">
                                <span class="slot">
                                    <IconifyIcon
                                        dropShadow={true}
                                        icon={showItemIcon
                                            ? weaponSubclassIcons[expandedItem?.subclassId]
                                            : inventoryTypeIcons[fixedInventoryType(expandedItem?.inventoryType)]}
                                    />
                                </span>

                                {#if hasItem}
                                    <CollectedIcon />
                                {/if}

                                {#if showItemIcon}
                                    <WowthingImage
                                        name={`item/${expandedItemId}`}
                                        size={48}
                                    />
                                {:else if classId}
                                    <ClassIcon
                                        {classId}
                                        size={48}
                                        border={2}
                                    />
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
