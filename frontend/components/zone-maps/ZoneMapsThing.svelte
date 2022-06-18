<script lang="ts">
    import { farmTypeIcon } from '@/data/farm'
    import { zoneMapState } from '@/stores/local-storage/zone-map'
    import { FarmIdType, FarmType } from '@/types/enums'
    import { tippyComponent } from '@/utils/tippy'
    import type { FarmStatus } from '@/types'
    import type { ZoneMapDataFarm } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import Tooltip from '@/components/tooltips/zone-maps/TooltipZoneMapsThing.svelte'

    export let farm: ZoneMapDataFarm
    export let status: FarmStatus

    let big: boolean
    let show: boolean
    $: {
        big = FarmType[farm.type].indexOf('Big') > 0

        show = true
        if (!$zoneMapState.showCompleted && !status.need) {
            show = false
        }
        if (!$zoneMapState.showKilled && status.need && status.characters.length === 0) {
            show = false
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

        &:hover .icon {
            color: #00ccff;
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
        margin-top: -4px;
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
    <div
        class="wrapper"
        class:active={status.need}
        style="--left: {farm.location[0]}%; --top: {farm.location[1]}%; --top-offset: {status.need ? (big ? '7px' : '7px') : '0px'};"
        use:tippyComponent={{
            component: Tooltip,
            props: {farm, status},
        }}
    >
        <WowheadLink
            id={farm.id}
            noTooltip={true}
            toComments={true}
            type={FarmIdType[farm.idType].toLowerCase()}
        >
            <div
                class="icon drop-shadow"
                class:active={status.need}
                class:inactive={!status.need}
                class:alliance={farm.faction === 'alliance'}
                class:horde={farm.faction === 'horde'}
            >
                <IconifyIcon
                    icon={farmTypeIcon[farm.type]}
                    scale={big ? '1.25' : '1'}
                />
            </div>

            {#if status.need && farm.type != FarmType.Vendor}
                <span
                    class:big
                    class:status-success={status.characters.length === 0}
                >{status.characters.length}</span>
            {/if}
        </WowheadLink>
    </div>
{/if}
