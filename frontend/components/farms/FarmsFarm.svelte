<script lang="ts">
    import Fa from 'svelte-fa'

    import type { FarmDataFarm } from '@/types/data'
    import type { FarmStatus } from '@/utils/get-farm-status'
    import { farmType } from '@/data/farm'
    import { tippyComponent } from '@/utils/tippy'

    import NpcLink from '@/components/links/NpcLink.svelte'
    import Tooltip from '@/components/tooltips/farm/TooltipFarm.svelte'

    export let farm: FarmDataFarm
    export let status: FarmStatus

    let big: boolean
    $: {
        big = farm.type.indexOf('Big') > 0
    }
</script>

<style lang="scss">
    .wrapper {
        position: absolute;
        left: var(--left);
        top: calc(var(--top) + var(--top-offset, 0px));
        transform: translate(-50%, -50%);
        text-align: center;
        width: 27px;

        &:hover .icon {
            color: #00ccff;
        }

    }
    .icon {
        pointer-events: none;

        &.active {
            color: #fff;
        }
        &.inactive {
            color: #009f00;
        }
        &.alliance {
            color: #4499ff;
        }
        &.horde {
            color: #ff8888;
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

        &.big {
            margin-top: -2px;
        }
    }
</style>

<div
    class="wrapper"
    class:active={status.need}
    style="--left: {farm.location[0]}%; --top: {farm.location[1]}%; --top-offset: {status.need ? (big ? '11px' : '7px') : '0px'};"
    use:tippyComponent={{
        component: Tooltip,
        props: {farm, status},
        tippyProps: {placement: 'right'},
    }}
>
    <NpcLink id={farm.npcId} noTooltip={true} toComments={true}>
        <div
            class="icon drop-shadow"
            class:active={status.need}
            class:inactive={!status.need}
            class:alliance={farm.faction === 'alliance'}
            class:horde={farm.faction === 'horde'}
        >
            <Fa
                fw
                icon={farmType[farm.type]}
                size={big ? 'lg' : 'md'}
            />
        </div>

        {#if status.need}
            <span
                class:big
                class:status-success={status.characters.length === 0}
            >{status.characters.length}</span>
        {/if}
    </NpcLink>
</div>
