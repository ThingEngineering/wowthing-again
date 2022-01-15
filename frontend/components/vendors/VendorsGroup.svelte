<script lang="ts">
    import { costMap, costOrder } from '@/data/vendors'
    import { userVendorStore } from '@/stores/user-vendors'
    import { FarmDropType } from '@/types/enums'
    import getPercentClass from '@/utils/get-percent-class'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { StaticDataVendorGroup, StaticDataVendorItem, UserCount } from '@/types'

    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let group: StaticDataVendorGroup
    export let stats: UserCount

    let linkType: string
    let percent: number
    let things: [StaticDataVendorItem, boolean][]
    $: {
        if (group.type === FarmDropType.Mount) {
            linkType = 'spell'
        }
        else if (group.type === FarmDropType.Pet) {
            linkType = 'npc'
        }
        else {
            linkType = 'item'
        }

        things = []
        for (const thing of group.things) {
            things.push([
                thing,
                $userVendorStore.data.userHas[`${group.type}-${thing.id}`],
            ])
        }

        // filter items probably

        percent = Math.floor((stats?.have ?? 0) / (stats?.total ?? 1) * 100)
    }
</script>

<style lang="scss">
    .costs {
        --image-border-width: 0;
        --image-margin-top: -4px;

        background: $highlight-background;
        display: flex;
        flex-direction: column;

        div {
            display: flex;
            font-size: 0.95rem;
            gap: 2px;
            line-height: 1.3;
            justify-content: flex-end;
        }
    }
</style>

<div class="collection-group">
    <h4 class="drop-shadow {getPercentClass(percent)}">
        {group.name}
        <CollectionCount counts={stats} />
    </h4>

    <div class="collection-objects">
        {#each things as [thing, userHas]}
            <div
                class="quality{thing.quality}"
                class:missing={userHas}
            >
                <WowheadLink
                    id={thing.id}
                    type={linkType}
                >
                    <WowthingImage
                        name="{linkType}/{thing.id}"
                        size={48}
                        border={2}
                    />
                </WowheadLink>

                {#if !userHas}
                    <div class="costs">
                        {#each costOrder as cost}
                            {#if thing.costs[cost]}
                                <div>
                                    {toNiceNumber(thing.costs[cost])}
                                    <WowheadLink
                                        type={costMap[cost][0]}
                                        id={costMap[cost][1]}
                                    >
                                        <WowthingImage
                                            name="{costMap[cost][0]}/{costMap[cost][1]}"
                                            size={16}
                                            border={0}
                                        />
                                    </WowheadLink>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
