<script lang="ts">
    import { activeView } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { userStore } from '@/stores';
    import { homeState } from '@/stores/local-storage';

    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte';

    export let sortKey: string;

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 5rem);
    }
</style>

{#each $userStore.homeLockouts as { difficulty, instanceId }}
    {@const instance = $staticStore.instances[instanceId]}
    {#if instance && viewHasLockout($activeView, difficulty, instanceId)}
        {@const sortField = `lockout:${instanceId}-${difficulty?.id || 0}`}
        <td
            class="sortable"
            class:sorted-by={$homeState.groupSort[sortKey] === sortField}
            on:click={() => setSorting(sortField)}
            on:keypress={() => setSorting(sortField)}
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    difficulty,
                    instanceId,
                },
            }}
        >
            {difficulty && difficulty.name !== 'World Boss'
                ? difficulty.shortName + '-'
                : ''}{instance.shortName}
        </td>
    {/if}
{/each}
