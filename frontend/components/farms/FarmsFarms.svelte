<script lang="ts">
    import { faSkull } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'

    import type {FarmDataFarm} from '@/types/data'
    import {tippyComponent} from '@/utils/tippy'

    import Tooltip from '@/components/tooltips/farm/TooltipFarm.svelte'

    export let farms: FarmDataFarm[]
</script>

<style lang="scss">
    div {
        position: absolute;
        left: var(--left);
        top: var(--top);
        filter: drop-shadow(0 0 3px #000);
        transform: translate(-50%, -50%);
    }
</style>

{#each farms as farm}
    <div
        style="--left: {farm.location[0]}%; --top: {farm.location[1]}%;"
        use:tippyComponent={{
            component: Tooltip,
            props: {farm},
            tippyProps: {placement: 'right'},
        }}
    >
        <Fa fw icon={faSkull} size="lg" />
    </div>
{/each}
