<script lang="ts">
    import { staticStore, userStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'

    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte'
</script>

<style lang="scss">
    td {
        @include cell-width(2.0rem, $maxWidth: 5.0rem);
    }
</style>

{#each $userStore.data.homeLockouts as {difficulty, instanceId}}
    {@const instance = $staticStore.data.instances[instanceId]}
    <td
        use:tippyComponent={{
            component: Tooltip,
            props: {
                difficulty,
                instanceId,
            }
        }}
    >
        {difficulty ? difficulty.shortName + '-' : ''}{instance.shortName}
    </td>
{/each}
