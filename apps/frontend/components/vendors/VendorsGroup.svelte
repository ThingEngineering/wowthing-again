<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { costOrder } from '@/data/vendors'
    import { manualStore, staticStore } from '@/stores'
    import { vendorState } from '@/stores/local-storage'
    import { userVendorStore } from '@/stores/user-vendors'
    import { RewardType } from '@/types/enums'
    import getPercentClass from '@/utils/get-percent-class'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { UserCount } from '@/types'
    import type { ManualDataVendorGroup, ManualDataVendorItem } from '@/types/data/manual'

    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let group: ManualDataVendorGroup
    export let stats: UserCount

    let element: HTMLElement
    let intersected = false
    let percent: number
    let things: [ManualDataVendorItem, string, number, boolean, [string, number, string][]][]
    $: {
        things = []
        for (const thing of group.sellsFiltered) {
            const userHas = $userVendorStore.data.userHas[`${thing.type}-${thing.id}`] === true
            if (($vendorState.showCollected && userHas) || ($vendorState.showUncollected && !userHas)) {
                const costs: [string, number, string][] = []
                if (!userHas) {
                    for (const costKey of costOrder) {
                        if (thing.costs[costKey]) {
                            costs.push([
                                'currency',
                                costKey,
                                toNiceNumber(thing.costs[costKey]),
                            ])
                        }
                    }
                }

                let linkType: string
                let linkId: number
                if (thing.type === RewardType.Mount) {
                    linkType = 'spell'
                    linkId = $staticStore.data.mounts[thing.id].spellId
                }
                else if (thing.type === RewardType.Pet) {
                    linkType = 'npc'
                    linkId = $staticStore.data.pets[thing.id].creatureId
                }
                else {
                    linkType = 'item'
                    linkId = thing.id
                }

                things.push([
                    thing,
                    linkType,
                    linkId,
                    userHas,
                    costs,
                ])
            }
        }

        percent = Math.floor((stats?.have ?? 0) / (stats?.total ?? 1) * 100)
    }
</script>

<style lang="scss">
    .collection-group {
        min-height: 96px;
    }
    .collection-item {
        min-height: 52px;
        width: 52px;
    }
    .costs {
        --image-border-width: 0;
        --image-margin-top: -4px;

        background: $highlight-background;
        display: flex;
        flex-direction: column;
        white-space: nowrap;

        div {
            display: flex;
            font-size: 0.95rem;
            gap: 2px;
            line-height: 1.3;
            justify-content: flex-end;
        }
    }
</style>

{#if things?.length > 0}
    <IntersectionObserver once {element} bind:intersecting={intersected}>
        <div class="collection-group" bind:this={element}>
            <h4 class="drop-shadow {getPercentClass(percent)}">
                {group.name}
                <CollectionCount counts={stats} />
            </h4>

            <div class="collection-objects" data-inter={intersected}>
                {#each things as [thing, linkType, linkId, userHas, costs]}
                    <div
                        class="collection-item quality{thing.quality || $manualStore.data.shared.items[thing.id]?.quality || 0}"
                        class:missing={
                            (!$vendorState.highlightMissing && !userHas) ||
                            ($vendorState.highlightMissing && userHas)
                        }
                        data-thing="{thing.type} {thing.id}"
                        style:height="{52 + (20 * costs.length)}px"
                    >
                        {#if intersected}
                            <WowheadLink
                                id={linkId}
                                type={linkType}
                            >
                                <WowthingImage
                                    name="{linkType}/{linkId}"
                                    size={48}
                                    border={2}
                                />
                            </WowheadLink>

                            {#if userHas}
                                <div class="collected-icon drop-shadow">
                                    <IconifyIcon icon={mdiCheckboxOutline} />
                                </div>
                            {:else}
                                <div class="costs quality1">
                                    {#each costs as [costType, costId, costValue]}
                                        <div>
                                            {costValue}
                                            <WowheadLink
                                                type={costType}
                                                id={costId}
                                            >
                                                <WowthingImage
                                                    name="{costType}/{costId}"
                                                    size={16}
                                                    border={0}
                                                />
                                            </WowheadLink>
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
