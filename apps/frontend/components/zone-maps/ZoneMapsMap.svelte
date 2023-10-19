<script lang="ts">
    import find from 'lodash/find'

    import { classOrder } from '@/data/character-class'
    import { iconStrings } from '@/data/icons'
    import { lazyStore, manualStore } from '@/stores'
    import { zoneMapState } from '@/stores/local-storage/zone-map'
    import { zoneMapMedia } from '@/stores/media-queries/zone-map'
    import { FarmAnchorPoint } from '@/enums/farm-anchor-point'
    import { FarmType } from '@/enums/farm-type'
    import { PlayableClass } from '@/enums/playable-class'
    import { RewardType } from '@/enums/reward-type'
    import { settingsStore } from '@/stores'
    import type { FarmStatus } from '@/types'
    import type { ManualDataZoneMapCategory, ManualDataZoneMapFarm } from '@/types/data/manual'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import Counter from './ZoneMapsCounter.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import Image from '@/shared/components/images/Image.svelte'
    import Loot from './ZoneMapsLoot.svelte'
    import Thing from './ZoneMapsThing.svelte'

    export let slug1: string
    export let slug2: string

    type FarmGroup = {
        group: ManualDataZoneMapFarm,
        children: [ManualDataZoneMapFarm, number][],
    }

    let categories: ManualDataZoneMapCategory[]
    let farms: ManualDataZoneMapFarm[]
    let farmStatuses: FarmStatus[]
    let groups: FarmGroup[]
    let height: number
    let width: number
    let slugKey: string

    $: {
        categories = find($manualStore.zoneMaps.sets, (s) => s?.[0]?.slug === slug1)
        if (slug2) {
            categories = categories.filter((s) => s?.slug === slug2)
        }
        slugKey = slug2 ? `${slug1}--${slug2}` : slug1

        farms = []
        if (categories?.length > 0) {
            farms = [...categories[0].farms]
            for (const vendorId of ($manualStore.shared.vendorsByMap[categories[0].mapName] || [])) {
                farms.push(...$manualStore.shared.vendors[vendorId].asFarms(categories[0].mapName))
            }

            farmStatuses = $lazyStore.zoneMaps.farmStatus[slugKey]
        }

        if ($zoneMapState.classFilters[slugKey] === undefined) {
            $zoneMapState.classExpanded[slugKey] = false
            $zoneMapState.classFilters[slugKey] = {}
        }

        const groupMap: Record<number, FarmGroup> = Object.fromEntries(
            farms.filter((farm) => farm.type === FarmType.Group)
                .map((farm) => [farm.id, {
                    group: farm,
                    children: [],
                }])
        )
        for (let farmIndex = 0; farmIndex < farms.length; farmIndex++) {
            const farm = farms[farmIndex]
            if (farm.groupId) {
                groupMap[farm.groupId].children.push([farm, farmIndex])
            }
        }

        groups = Object.values(groupMap)
        for (const group of groups) {
            group.children.sort((a, b) => {
                const aData = [
                    a[0].faction || 'zzz',
                    a[0].name
                ].join('|')
                const bData = [
                    b[0].faction || 'zzz',
                    b[0].name
                ].join('|')
                return aData.localeCompare(bData)
            })
        }
    }

    let loots: [ManualDataZoneMapFarm, number[]][]
    $: {
        loots = []
        if (farms && $zoneMapState.lootExpanded[slugKey]) {
            for (let farmIndex = 0; farmIndex < farms.length; farmIndex++) {
                const farm = farms[farmIndex]
                const farmStatus = farmStatuses[farmIndex]
                if (farmStatus.need && lootFarmTypes.indexOf(farm.type) >= 0) {
                    const needDrops: number[] = []

                    for (let dropIndex = 0; dropIndex < farmStatus.drops.length; dropIndex++) {
                        const drop = farm.drops[dropIndex]
                        const dropStatus = farmStatus.drops[dropIndex]
                        if (dropStatus.need && lootRewardTypes.indexOf(drop.type) >= 0) {
                            needDrops.push(dropIndex)
                        }
                    }

                    if (needDrops.length > 0) {
                        loots.push([farms[farmIndex], needDrops])
                   }
                }
            }
        }
    }

    $: {
        [width, height] = $zoneMapMedia
    }

    $: lessHeight = $settingsStore?.layout?.newNavigation ? '6.4rem' : '4.4rem'

    const getGroupWidth = function(len: number): string {
        if (len < 3) {
            return null
        }
        const sqrt = Math.ceil(Math.sqrt(len))
        // border + padding + icons
        return `calc(2px + 0.2rem + (24px * ${sqrt})`
    }

    const getAnchorX = function(farm: ManualDataZoneMapFarm): string {
        if (!farm.anchorPoint) {
            return '-50%'
        }

        if (
            farm.anchorPoint === FarmAnchorPoint.TopLeft ||
            farm.anchorPoint === FarmAnchorPoint.Left ||
            farm.anchorPoint === FarmAnchorPoint.BottomLeft
        ) {
            return '-12px'
        }
    }

    const getAnchorY = function(farm: ManualDataZoneMapFarm): string {
        if (!farm.anchorPoint) {
            return '-50%'
        }

        if (
            farm.anchorPoint === FarmAnchorPoint.TopLeft ||
            farm.anchorPoint === FarmAnchorPoint.Top ||
            farm.anchorPoint === FarmAnchorPoint.TopRight
        ) {
            return '-12px'
        }
    }

    const lootFarmTypes: FarmType[] = [
        FarmType.Event,
        FarmType.EventBig,
        FarmType.Kill,
        FarmType.KillBig,
        FarmType.Treasure,
    ]
    const lootRewardTypes: RewardType[] = [
        RewardType.Armor,
        RewardType.Cosmetic,
        RewardType.Illusion,
        RewardType.Mount,
        RewardType.Pet,
        RewardType.Toy,
        RewardType.Weapon,
    ]
</script>

<style lang="scss">
    .overlay-box {
        background: $highlight-background;
        border: 1px solid $border-color;
        position: absolute;
        z-index: 10;
    }
    .zone-map {
        --image-border-radius: 0;
        --image-border-width: 2px;

        position: relative;

        :global(> img) {
            max-height: calc(100vh - var(--less-height, 6.4rem));
            width: auto;
        }
    }
    .toggles {
        display: flex;
        justify-content: center;
        padding: 0.2rem 0.3rem;
        white-space: nowrap;
    }
    .setting-toggles {
        left: 50%;
        top: 1px;
        transform: translateX(-50%);

        & :global(fieldset:not(:first-child)) {
            margin-left: 0.3rem;
        }
    }
    .class-toggles {
        --image-border-radius: 50%;

        align-items: center;
        cursor: pointer;
        padding-left: 0.5rem;
        right: 1px;
        top: 1px;

        :global(img) {
            margin-left: 2px;
        }
    }
    .class-list {
        flex-direction: column;
        position: absolute;
        right: 1px;
        top: 2.1rem;
    }
    .toggle-group {
        display: flex;
        height: 1.5rem;

        &:not(:first-child) {
            border-left: 1px solid $border-color;
            margin-left: 0.5rem;
            padding-left: 0.5rem;
        }
    }
    .checkbox-counter {
        align-items: flex-end;
        display: flex;
        flex-direction: column;
    }
    .loot-list-toggle {
        --image-margin-top: -4px;

        bottom: 1px;
        left: 1px;
        padding: 0.2rem 0.4rem 0.2rem 0.4rem;
    }
    .loot-list {
        --image-margin-top: -4px;
        --scale: 0.9;

        border-bottom-width: 0;
        border-left-width: 0;
        border-right-width: 0;
        bottom: 33px;
        left: 1px;
    }
    .credits {
        bottom: 1px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        padding: 0 1px;
        position: absolute;
        right: 0;
        z-index: 10;

        div {
            padding: 0.1rem 0.4rem 0.2rem;

            & + div {
                border-right: 1px solid $border-color;
            }
        }
    }
    .group-container {
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        flex-wrap: wrap;
        padding: 0.1rem;
        position: absolute;
        transform: scale(0.9) translate(var(--translate-x, -50%), var(--translate-y, -50%));

        :global(.wrapper) {
            left: initial !important;
            position: relative !important;
            top: initial !important;
            transform: initial !important;
        }
    }
</style>

{#if categories?.length > 0}
    <div
        class="zone-map"
        style:--less-height={lessHeight}
    >
        <div class="toggles setting-toggles overlay-box">
            <div class="toggle-group">
                <Checkbox
                    name="show_completed"
                    bind:value={$zoneMapState.showCompleted}
                >Completed</Checkbox>
                <Checkbox
                    name="show_killed"
                    bind:value={$zoneMapState.showKilled}
                >Killed</Checkbox>
            </div>

            <div class="toggle-group">
                <div class="checkbox-counter">
                    <Checkbox
                        name="track_achievements"
                        bind:value={$zoneMapState.trackAchievements}
                    >Achievements</Checkbox>

                    <Counter key={slugKey} type={RewardType.Achievement} />
                </div>

                <div class="checkbox-counter">
                    <Checkbox
                        name="track_mounts"
                        bind:value={$zoneMapState.trackMounts}
                    >Mounts</Checkbox>

                    <Counter key={slugKey} type={RewardType.Mount} />
                </div>

                <div class="checkbox-counter">
                    <Checkbox
                        name="track_pets"
                        bind:value={$zoneMapState.trackPets}
                    >Pets</Checkbox>

                    <Counter key={slugKey} type={RewardType.Pet} />
                </div>

                <div class="checkbox-counter">
                    <Checkbox
                        name="track_quests"
                        bind:value={$zoneMapState.trackQuests}
                    >Quests</Checkbox>

                    <Counter key={slugKey} type={RewardType.Quest} />
                </div>

                <div class="checkbox-counter">
                    <Checkbox
                        name="track_toys"
                        bind:value={$zoneMapState.trackToys}
                    >Toys</Checkbox>

                    <Counter key={slugKey} type={RewardType.Toy} />
                </div>

                <div class="checkbox-counter">
                    <Checkbox
                        name="track_transmog"
                        bind:value={$zoneMapState.trackTransmog}
                    >Transmog</Checkbox>

                    <Counter key={slugKey} type={RewardType.Transmog} />
                </div>
                
                <div class="checkbox-counter">
                    <Checkbox
                        name="track_vendors"
                        bind:value={$zoneMapState.trackVendors}
                    >Vendors</Checkbox>
                </div>
            </div>
        </div>

        <div
            class="toggles class-toggles overlay-box"
            on:click={() => $zoneMapState.classExpanded[slugKey] = !$zoneMapState.classExpanded[slugKey]}
            on:keypress={() => $zoneMapState.classExpanded[slugKey] = !$zoneMapState.classExpanded[slugKey]}
        >
            Class:

            {#each classOrder.filter((c) => $zoneMapState.classFilters[slugKey][c] === true) as classId}
                <ClassIcon size={20} classId={classId} />
            {:else}
                ALL
            {/each}

            {#if $zoneMapState.maxLevelOnly}
            | MAX
            {/if}

            <IconifyIcon
                icon={iconStrings['chevron-' + ($zoneMapState.classExpanded[slugKey] ? 'down' : 'right')]}
            />
        </div>

        {#if $zoneMapState.classExpanded[slugKey]}
            <div class="toggles class-list overlay-box">
                {#each classOrder as classId}
                    <Checkbox
                        name="class_{classId}"
                        textClass="class-{classId}"
                        bind:value={$zoneMapState.classFilters[slugKey][classId]}
                    >{PlayableClass[classId]}</Checkbox>
                {/each}
                <hr>
                <Checkbox
                    name="max_level"
                    bind:value={$zoneMapState.maxLevelOnly}
                >Max level only</Checkbox>
            </div>
        {/if}

        <Image
            src="https://img.wowthing.org/maps/{categories[0].mapName}_{width}_{height}.webp"
            alt="Map of {categories[0].name}"
            border={2}
            {width}
            {height}
        />

        {#each farms as farm, farmIndex}
            {#if farm.type !== FarmType.Group && !farm.groupId}
                <Thing
                    map={categories[0]}
                    status={farmStatuses[farmIndex]}
                    {farm}
                />
            {/if}
        {/each}

        {#each groups as {group, children}}
            <div
                class="border group-container"
                style:left="{group.location[0]}%"
                style:top="{group.location[1]}%"
                style:width="{getGroupWidth(children.length)}"
                style:--translate-x={getAnchorX(group)}
                style:--translate-y={getAnchorY(group)}
            >
                {#each children as [farm, farmIndex]}
                    <Thing
                        map={categories[0]}
                        status={farmStatuses[farmIndex]}
                        {farm}
                    />
                {/each}
            </div>
        {/each}

        <div
            class="loot-list-toggle overlay-box"
            on:click={() => $zoneMapState.lootExpanded[slugKey] = !$zoneMapState.lootExpanded[slugKey]}
            on:keypress={() => $zoneMapState.lootExpanded[slugKey] = !$zoneMapState.lootExpanded[slugKey]}
        >
            Loot list

            <IconifyIcon
                icon={iconStrings['chevron-' + ($zoneMapState.lootExpanded[slugKey] ? 'up' : 'right')]}
            />
        </div>

        {#if $zoneMapState.lootExpanded[slugKey] && loots?.length > 0}
            <div class="loot-list overlay-box">
                <Loot {loots} />
            </div>
        {/if}

        <div class="credits overlay-box">
            <div>
                Data sources:
                <a href="https://github.com/zarillion/handynotes-plugins">HandyNotes Plugins</a> /
                <a href="https://www.wowdb.com">WoWDB</a> /
                <a href="https://www.wowhead.com">Wowhead</a> /
                <a href="https://wow.tools">WoW.tools</a>
            </div>

            {#if categories[0].wowheadGuide}
                <div>
                    <a href="{categories[0].wowheadGuide}">Wowhead guide</a>
                </div>
            {/if}
        </div>
    </div>
{/if}
