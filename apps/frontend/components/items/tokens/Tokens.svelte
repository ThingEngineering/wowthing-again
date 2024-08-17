<script lang="ts">
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { inventoryTypeIcons } from '@/shared/icons/mappings';
    import { itemStore, journalStore, userStore } from '@/stores';
    import type { JournalDataInstance, JournalDataTier } from '@/types/data/journal';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { fixedInventoryType } from '@/utils/fixed-inventory-type';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    export let slug1: string;
    export let slug2: string;

    type InstanceData = [JournalDataInstance, Set<number>][];
    type TierData = [JournalDataTier, InstanceData][];
    let tiers: TierData;
    $: {
        const lookup = new Set($journalStore.tokenEncounters);
        console.log(lookup);

        tiers = [];
        for (const tier of $journalStore.tiers) {
            if (tier === null) { break; }
            if (!lookup.has(tier.id.toString())) { continue; }

            const instances: InstanceData = [];

            for (const instance of tier.instances.filter((instance) => !!instance)) {
                if (!lookup.has(`${tier.id}|${instance.id}`)) { continue; }

                const items: Set<number> = new Set();

                for (const encounter of instance.encounters) {
                    if (!lookup.has(`${tier.id}|${instance.id}|${encounter.id}`)) { continue; }

                    for (const group of encounter.groups) {
                        for (const item of group.items) {
                            const sourceIds = $journalStore.expandedItem[item.id] || [];
                            for (const sourceId of sourceIds) {
                                if ($userStore.itemsById[sourceId]) {
                                    items.add(sourceId);
                                }
                            }
                        }
                    }
                }

                if (items.size > 0) {
                    instances.push([instance, items]);
                }
            }

            if (instances.length > 0) {
                tiers.push([tier, instances]);
            }
        }

        console.log(tiers);
    }

    function playableClassFromMask(classMask: number) {
        return classMask in PlayableClassMask
            ? PlayableClass[PlayableClassMask[classMask] as keyof typeof PlayableClass]
            : 0
    }
</script>

<style lang="scss">
    .instances {
        --image-border-width: 1px;
        // --image-margin-top: -4px;
        
        columns: 3;
    }
    .item {
        break-inside: avoid;
        overflow: hidden; /* Firefox fix */
    }
    .expanded {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    .set-item {
        --image-border-width: 2px;

        position: relative;

        &.faded {
            filter: grayscale(50%);
            opacity: 0.5;
        }
    }
    .slot {
        background: rgba(0, 0, 0, 0.8);
        border-bottom: 1px solid $border-color;
        border-right: 1px solid $border-color;
        border-radius: $border-radius;
        color: #ddd;
        left: 0px;
        position: absolute;
        top: 0px;
        transform: scale(80%);
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

<UnderConstruction />

<div class="instances">
    {#each tiers as [tier, instances]}
        {#each instances as [instance, items]}
            <div class="name">
                {tier.name} &gt; {instance.name}
            </div>
            <div class="items">
                {#each items as itemId}
                    {@const expandsTo = $journalStore.itemExpansion[itemId]}
                    {@const item = $itemStore.items[itemId]}
                    {@const haveItems = $userStore.itemsById[itemId]}
                    {@const haveCount = haveItems.reduce((a, b) => a + b[1].length, 0)}
                    <div class="item">
                        {haveCount}x
                        <span class="quality{item.quality}">
                            <WowheadLink id={itemId} type="item">
                                <WowthingImage name="item/{itemId}" size={20} />
                                {item.name}
                            </WowheadLink>
                        </span>
                        
                        <div class="expanded">
                            {#each expandsTo as expandedItemId}
                                {@const expandedItem = $itemStore.items[expandedItemId]}
                                {@const appearance = expandedItem.appearances[0]}
                                {@const hasSource = $userStore.hasSourceV2.get(appearance.modifier).has(expandedItemId)}
                                {@const classId = playableClassFromMask(expandedItem.classMask)}
                                {@const specIds = $itemStore.specOverrides[expandedItemId]}
                                <span
                                    class="set-item class-{classId}"
                                    class:faded={hasSource}
                                >
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
                                </span>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    {/each}
</div>
