<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer'

    import { itemStore, lazyStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { vendorState } from '@/stores/local-storage'
    import { Faction } from '@/enums/faction'
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class'
    import { RewardType } from '@/enums/reward-type'
    import { ThingData } from '@/types/vendors'
    import getPercentClass from '@/utils/get-percent-class'
    import type { UserCount } from '@/types'
    import type { ManualDataVendorGroup } from '@/types/data/manual'

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte'
    import CurrencyLink from '@/shared/components/links/CurrencyLink.svelte'
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let group: ManualDataVendorGroup
    export let stats: UserCount
    export let useV2: boolean

    let element: HTMLElement
    let intersected = false
    let percent: number
    let things: ThingData[]
    $: {
        things = []
        for (const thing of group.sellsFiltered) {
            const thingKey = `${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`
            const userHas = $lazyStore.vendors.userHas[thingKey] === true
            if (($vendorState.showCollected && userHas) || ($vendorState.showUncollected && !userHas)) {
                const thingData = new ThingData(thing, userHas)

                thingData.quality = thing.quality || $itemStore.items[thing.id]?.quality || 0

                if (thing.type === RewardType.Mount) {
                    thingData.linkType = 'spell'
                    thingData.linkId = $staticStore.mounts[thing.id]?.spellId
                }
                else if (thing.type === RewardType.Pet) {
                    thingData.linkType = 'npc'
                    thingData.linkId = $staticStore.pets[thing.id].creatureId
                }
                else {
                    thingData.linkType = 'item'
                    thingData.linkId = thing.id
                    
                    if (thing.bonusIds) {
                        thingData.extraParams['bonus'] = thing.bonusIds
                            .map((bonusId) => bonusId.toString())
                            .join(':')
                    }

                    if (thing.classMask in PlayableClassMask) {
                        thingData.classId = PlayableClass[PlayableClassMask[thing.classMask] as keyof typeof PlayableClass]
                    }
                    else {
                        thingData.classId = 0
                    }
                }

                things.push(thingData)
            }
        }

        percent = Math.floor((stats?.have ?? 0) / (stats?.total ?? 1) * 100)
    }
</script>

<style lang="scss">
    .collection-v2-group {
        width: 17.6rem;
    }
    .collection-objects {
        min-height: 52px;
    }
    .collection-object {
        min-height: 52px;
        width: 52px;
    }
    .collected-appearances {
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        color: $color-success;
        line-height: 1;
        padding: 0.1rem 0.2rem;
        pointer-events: none;
        position: absolute;
        top: 30px;
        right: 1px;
    }
    .costs {
        --image-border-width: 0;
        --image-margin-top: -4px;

        background: $highlight-background;
        display: flex;
        flex-direction: column;
        white-space: nowrap;

        :global(a) {
            text-align: right;
            width: 100%;
        }

        div {
            display: flex;
            font-size: 0.95rem;
            gap: 2px;
            line-height: 1.3;
            justify-content: flex-end;
        }
    }
    .icon {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        width: 24px;
        pointer-events: none;
        position: absolute;
    }
    .icon-class {
        left: -1px;
        top: -1px;
    }
    .icon-faction {
        left: -1px;
        top: 29px;
    }
    .title {
        align-content: flex-start;
        display: flex;
        padding-right: 0.5rem;

        h4 {
            width: auto;
        }
    }
    .stats {
        justify-content: center;
        display: flex;
        font-size: 0.85rem;
        gap: 3px;
        pointer-events: none;
        position: absolute;
        top: 36px;
        width: 100%;
        letter-spacing: -0.1ch;

        span:nth-child(2) {
            font-size: 0.7rem;
        }
    }
</style>

{#if things?.length > 0}
    <IntersectionObserver
        once
        {element}
        bind:intersecting={intersected}
    >
        <div
            bind:this={element}
            class="collection{useV2 ? '-v2' : ''}-group"
        >
            <div class="title">
                <h4 class="drop-shadow text-overflow {getPercentClass(percent)}">
                    {group.name}
                </h4>
                <CollectibleCount counts={stats} />
            </div>

            <div class="collection-objects">
                {#each things as thing}
                    <div
                        class="collection-object quality{thing.quality}"
                        class:missing={
                            (!$vendorState.highlightMissing && !thing.userHas) ||
                            ($vendorState.highlightMissing && thing.userHas)
                        }
                        style:height="{!thing.userHas ? (52 + (20 * thing.item.sortedCosts.length)) + 'px' : null}"
                    >
                        {#if intersected}
                            <WowheadLink
                                id={thing.linkId}
                                type={thing.linkType}
                                extraParams={thing.extraParams}
                                tooltip={thing.tooltip}
                            >
                                <WowthingImage
                                    name="{thing.linkType}/{thing.linkId}"
                                    size={48}
                                    border={2}
                                />
                            </WowheadLink>

                            {#if thing.item.extraAppearances > 0}
                                <div class="collected-appearances background-box drop-shadow">
                                    +{thing.item.extraAppearances}
                                </div>
                            {/if}

                            {#if thing.item.faction !== Faction.Both}
                                <div class="icon icon-faction drop-shadow">
                                    <FactionIcon
                                        faction={thing.item.faction}
                                        border={2}
                                        size={20}
                                        useTooltip={false}
                                    />
                                </div>
                            {/if}

                            {#if thing.classId > 0}
                                <div class="icon icon-class class-{thing.classId} drop-shadow">
                                    <ClassIcon
                                        border={2}
                                        size={20}
                                        classId={thing.classId}
                                        useTooltip={false}
                                    />
                                </div>
                            {/if}

                            {#if $itemStore.teachesTransmog[thing.item.id]}
                                {@const setStats = $lazyStore.transmog.stats[`transmogSet:${$itemStore.teachesTransmog[thing.item.id]}`]}
                                {#if setStats}
                                    <div class="stats pill">
                                        <span class="{getPercentClass(setStats.percent)}">{setStats.have}</span>
                                        <span class="quality1">/</span>
                                        <span class="{getPercentClass(setStats.percent)}">{setStats.total}</span>
                                    </div>
                                {/if}
                            {/if}
            
                            {#if thing.userHas}
                                <CollectedIcon />
                            {:else}
                                <div class="costs quality1">
                                    {#each thing.item.sortedCosts as [costType, costId, costValue]}
                                        <div>
                                            <CurrencyLink
                                                currencyId={costType === 'currency' ? costId : undefined}
                                                itemId={costType === 'item' ? costId : undefined}
                                            >
                                                {costValue}
                                                <WowthingImage
                                                    name="{costType}/{costId}"
                                                    size={16}
                                                    border={0}
                                                />
                                            </CurrencyLink>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </IntersectionObserver>
{/if}
