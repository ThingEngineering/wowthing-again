<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { costOrder } from '@/data/vendors'
    import { staticStore } from '@/stores'
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
    let idFunc: (id: number) => number
    let intersected = false
    let linkType: string
    let percent: number
    let things: [ManualDataVendorItem, boolean, [string, number, string][]][]
    $: {
        if (group.type === RewardType.Mount) {
            idFunc = (mountId: number) => $staticStore.data.mounts[mountId].spellId
            linkType = 'spell'
        }
        else if (group.type === RewardType.Pet) {
            idFunc = (petId: number) => $staticStore.data.pets[petId].creatureId
            linkType = 'npc'
        }
        else {
            idFunc = (id: number) => id
            linkType = 'item'
        }

        things = []
        for (const thing of group.sellsFiltered) {
            const userHas = $userVendorStore.data.userHas[`${group.type}-${thing.id}`] === true
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

                things.push([
                    thing,
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
                {#each things as [thing, userHas, costs]}
                    {@const thingId = idFunc(thing.id)}
                    <div
                        class="collection-item quality{thing.quality}"
                        class:missing={
                            (!$vendorState.highlightMissing && !userHas) ||
                            ($vendorState.highlightMissing && userHas)
                        }
                        style:height="{52 + (20 * costs.length)}px"
                    >
                        {#if intersected}
                            <WowheadLink
                                id={thingId}
                                type={linkType}
                            >
                                <WowthingImage
                                    name="{linkType}/{thingId}"
                                    size={48}
                                    border={2}
                                />
                            </WowheadLink>

                            {#if userHas}
                                <div class="collected-icon drop-shadow">
                                    <IconifyIcon icon={mdiCheckboxOutline} />
                                </div>
                            {:else}
                                <div class="costs">
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
