<script lang="ts">
    import { faSkull } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'

    import {tippyComponent} from '@/utils/tippy'
    import type {FarmDataFarm} from '@/types/data'
    import type {FarmStatus} from '@/utils/get-farm-status'

    import Tooltip from '@/components/tooltips/farm/TooltipFarm.svelte'

    export let farm: FarmDataFarm
    export let status: FarmStatus
</script>

<style lang="scss">
    .wrapper {
        position: absolute;
        left: var(--left);
        top: calc(var(--top) + var(--top-offset, 0px));
        transform: translate(-50%, -50%);
        text-align: center;
        width: 22px;
    }
    span {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        display: block;
        font-size: 0.9rem;
        line-height: 1;
        margin-top: -4px;
        padding: 0 2px 1px 2px;
        word-spacing: -0.2ch;
    }
    .icon {
        filter: drop-shadow(0 0 3px #000);
    }
    .inactive {
        color: #009f00;
    }
</style>

<div
    class="wrapper"
    style="--left: {farm.location[0]}%; --top: {farm.location[1]}%; --top-offset: {status.need ? '8px' : '0px'};"
    use:tippyComponent={{
        component: Tooltip,
        props: {farm, status},
        tippyProps: {placement: 'right'},
    }}
>
    <div class="icon" class:inactive={!status.need}>
        <Fa fw icon={faSkull} />
    </div>

    {#if status.need}
        <span class:status-success={status.characters.length === 0}>{status.characters.length}</span>
    {/if}
</div>
