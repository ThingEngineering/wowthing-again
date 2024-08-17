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
        position: absolute;
        top: 0px;
        transform: scale(0.75);
    }
    .specializations {
        --image-border-width: 1px;

        justify-content: center;
        bottom: 2px;
        display: flex;
        gap: 2px;
        left: 0;
        position: absolute;
        width: 100%;
    }
</style>

<IntersectionObserver
    once
    {element}
    bind:intersecting={intersected}
>
    <div class="collection-v2-group" bind:this={element}>
        <div class="title">
            <h4 class="text-overflow">
                {haveCount}x
                <WowheadLink id={itemId} type="item" extraClass="quality{item.quality}">
                    <WowthingImage name="item/{itemId}" size={20} />
                    {item.name}
                </WowheadLink>
            </h4>
        </div>
        
        <div class="collection-objects">
            {#each expandsTo as expandedItemId}
                {@const expandedItem = $itemStore.items[expandedItemId]}
                {@const appearance = expandedItem.appearances[0]}
                {@const hasSource = $userStore.hasSourceV2.get(appearance.modifier).has(expandedItemId)}
                {@const classId = playableClassFromMask(expandedItem.classMask)}
                {@const specIds = $itemStore.specOverrides[expandedItemId]}
                {#if ($browserStore.tokens.showCollected && hasSource) ||
                    ($browserStore.tokens.showUncollected && !hasSource)}
                    <div
                        class="collection-object class-{classId}"
                        class:missing={
                            (!$browserStore.tokens.highlightMissing && !hasSource) ||
                            ($browserStore.tokens.highlightMissing && hasSource)
                        }
                    >
                        {#if intersected}
                            <WowheadLink id={expandedItemId} type="item">
                                <span class="slot drop-shadow">
                                    <IconifyIcon
                                        dropShadow={true}
                                        icon={inventoryTypeIcons[fixedInventoryType(expandedItem?.inventoryType)]}
                                    />
                                </span>

                                {#if hasSource}
                                    <CollectedIcon />
                                {/if}

                                {#if specIds?.length === 1}
                                    <SpecializationIcon
                                        specId={specIds[0]}
                                        border={2}
                                        size={48}
                                    />
                                {:else if classId}
                                    <ClassIcon
                                        {classId}
                                        size={48}
                                        border={2}
                                    />
                                    {#if specIds?.length > 0 && specIds.length < 3}
                                        <span class="specializations drop-shadow">
                                            {#each specIds as specId}
                                                <SpecializationIcon {specId} size={16} />
                                            {/each}
                                        </span>
                                    {/if}
                                {:else}
                                    uhh
                                {/if}
                            </WowheadLink>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</IntersectionObserver>
