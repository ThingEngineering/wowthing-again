<script lang="ts">
    import { FarmIdType } from '@/enums/farm-id-type'
    import { FarmType } from '@/enums/farm-type'
    import { journalStore, lazyStore, timeStore, userStore } from '@/stores'
    import { zoneMapState } from '@/stores/local-storage/zone-map'
    import { tippyComponent } from '@/utils/tippy'
    import { getInstanceFarm } from '@/utils/get-instance-farm'
    import { getFarmIcon } from '@/utils/zone-maps'
    import type { FarmStatus } from '@/types'
    import type { ManualDataZoneMapCategory, ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual'

    import IconifyIcon from '@/shared/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/links/WowheadLink.svelte'
    import Tooltip from '@/components/tooltips/zone-maps/TooltipZoneMapsThing.svelte'

    export let farm: ManualDataZoneMapFarm
    export let map: ManualDataZoneMapCategory
    export let status: FarmStatus

    let big: boolean
    let classes: string[]
    let drops: ManualDataZoneMapDrop[]
    let locations: [string, string][]
    let show: boolean
    let topOffset: string
    $: {
        if (farm.type === FarmType.Dungeon || farm.type === FarmType.Raid) {
            [status, drops] = getInstanceFarm(
                $timeStore,
                $journalStore,
                $lazyStore,
                $userStore,
                farm
            )
            //big = farm.type === FarmType.Raid
            topOffset = '0px'
        }
        else {
            big = FarmType[farm.type].indexOf('Big') > 0
            drops = farm.drops
            topOffset = (status.need && farm.type !== FarmType.Vendor) ? (big ? '7px' : '7px') : '0px'
        }

        show = true
        if (!$zoneMapState.showCompleted && !status.need) {
            show = false
        }
        if (!$zoneMapState.showKilled && status.need && status.characters.length === 0) {
            show = false
        }

        classes = ['icon', 'drop-shadow']
        classes.push(status.need ? 'active' : 'inactive')
        if (farm.faction) {
            classes.push(farm.faction)
        }
        if (farm.type === FarmType.Dungeon) {
            classes.push('dungeon')
        }
        if (farm.type === FarmType.Raid) {
            classes.push('raid')
        }

        locations = []
        for (let i = 0; i < farm.location.length; i += 2) {
            locations.push([farm.location[i], farm.location[i + 1]])
        }
    }
</script>

<style lang="scss">
    .wrapper {
        --shadow-color: rgba(0, 0, 0, 0.75);

        position: absolute;
        left: var(--left);
        top: calc(var(--top) + var(--top-offset, 0px));
        transform: translate(-50%, -50%);
        text-align: center;
        width: 24px;

        &:hover {
            z-index: 99999 !important;
            
            .icon {
                color: #00ccff;
            }
        }
        &.active {
            z-index: 5;
        }
    }
    .icon {
        pointer-events: none;
        z-index: 3;

        &.active {
            color: #fff;

            &.alliance {
                color: #4499ff;
            }
            &.horde {
                color: #ff8888;
            }
            &.dungeon {
                color: #fff53f;
            }
            &.raid {
                color: #fb7fff;
            }
        }
        &.inactive {
            color: #00bb00;
        }
    }
    span {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        color: #fff;
        display: block;
        font-size: 0.9rem;
        line-height: 1;
        margin-top: -1px;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        word-spacing: -0.2ch;
        z-index: 6;

        &.big {
            margin-top: -2px;
        }
    }
</style>

{#if show}
    {@const [icon, scale] = getFarmIcon(farm)}
    {#each locations as [xPos, yPos]}
        <div
            class="wrapper"
            class:active={status.need}
            style="--left: {xPos}%; --top: {yPos}%; --top-offset: {topOffset};"
            use:tippyComponent={{
                component: Tooltip,
                props: {
                    drops,
                    farm,
                    map,
                    status,
                },
            }}
        >
            {#if farm.type === FarmType.Dungeon || farm.type === FarmType.Raid}
                <a href="#/journal/{status.link}">
                    <div class="{classes.join(' ')}">
                        <IconifyIcon
                            {icon}
                            scale={'1'}
                        />
                    </div>
                </a>
            {:else}
                <WowheadLink
                    id={farm.id}
                    noTooltip={true}
                    toComments={true}
                    type={FarmIdType[farm.idType].toLowerCase()}
                >
                    <div class="{classes.join(' ')}">
                        <IconifyIcon
                            {icon}
                            scale={big ? '1.25' : scale}
                        />
                    </div>

                    {#if status.need && farm.type != FarmType.Vendor && map.mapName !== 'misc_exiles_reach'}
                        <span
                            class:big
                            class:status-success={status.characters.length === 0}
                        >{status.characters.length}</span>
                    {/if}
                </WowheadLink>
            {/if}
        </div>
    {/each}
{/if}
