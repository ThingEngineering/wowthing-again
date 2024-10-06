<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { inventoryTypeIcons } from '@/shared/icons/mappings';
    import { browserStore } from '@/shared/stores/browser';
    import { fixedInventoryType } from '@/utils/fixed-inventory-type';
    import { itemStore, journalStore, userStore } from '@/stores';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { ItemFlags } from '@/enums/item-flags';
    import { settingsStore } from '@/shared/stores/settings';

    export let itemId: number

    let element: HTMLElement
    let intersected = false

    $: expandsTo = $journalStore.itemExpansion[itemId];
    $: item = $itemStore.items[itemId];
    $: haveItems = $userStore.itemsById[itemId];
    $: haveCount = haveItems.reduce((a, b) => a + b[1].length, 0);

    function playableClassFromMask(classMask: number) {
        return classMask in PlayableClassMask
            ? PlayableClass[PlayableClassMask[classMask] as keyof typeof PlayableClass]
            : 0
    }
</script>

<style lang="scss">
    h4 {
        --image-margin-top: -4px;
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
</style>

<IntersectionObserver
    once
    {element}
    bind:intersecting={intersected}
>
    <div class="collection-v2-group" bind:this={element}>
        <h4 class="text-overflow">
            {haveCount}x
            {#if (item.flags & ItemFlags.HeroicDifficulty) > 0}
                <code>[H]</code>
            {/if}
            <WowheadLink id={itemId} type="item" extraClass="quality{item.quality}">
                <WowthingImage name="item/{itemId}" size={20} />
                {item.name}
            </WowheadLink>
        </h4>
        
        <div class="collection-objects">
            {#each expandsTo as expandedItemId}
                {@const expandedItem = $itemStore.items[expandedItemId]}
                {@const appearance = expandedItem.appearances[0]}
                {@const hasItem = $settingsStore.transmog.completionistMode
                    ? $userStore.hasSourceV2.get(appearance.modifier).has(expandedItemId)
                    : $userStore.hasAppearance.has(appearance.appearanceId)
                }
                {@const classId = playableClassFromMask(expandedItem.classMask)}
                {@const specIds = $itemStore.specOverrides[expandedItemId]}
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
                                        icon={inventoryTypeIcons[fixedInventoryType(expandedItem?.inventoryType)]}
                                    />
                                </span>

                                {#if hasItem}
                                    <CollectedIcon />
                                {/if}

                                {#if classId}
                                    <ClassIcon
                                        {classId}
                                        size={48}
                                        border={2}
                                    />
                                {/if}

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
                            </WowheadLink>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</IntersectionObserver>
