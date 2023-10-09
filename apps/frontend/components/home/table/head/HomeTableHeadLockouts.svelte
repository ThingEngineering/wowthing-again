<script lang="ts">
    import { userStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import { homeState } from '@/stores/local-storage'
    import { tippyComponent } from '@/utils/tippy'

    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte'

    export let groupIndex: number

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2.0rem, $maxWidth: 5.0rem);
    }
</style>

{#each $userStore.homeLockouts as {difficulty, instanceId}}
    {@const instance = $staticStore.instances[instanceId]}
    {#if instance}
        {@const sortKey = `lockout:${instanceId}-${difficulty?.id || 0}`}
        <td
            class="sortable"
            class:sorted-by={$homeState.groupSort[groupIndex] === sortKey}
            on:click={() => setSorting(sortKey)}
            on:keypress={() => setSorting(sortKey)}
            use:tippyComponent={{
                component: Tooltip,
                props: {
                    difficulty,
                    instanceId,
                }
            }}
        >
            {difficulty && difficulty.name !== 'World Boss' ? difficulty.shortName + '-' : ''}{instance.shortName}
        </td>
    {/if}
{/each}
