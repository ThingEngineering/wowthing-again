<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { userState } from '@/user-home/state/user';
    import type { SortableProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte';

    let { getSortState, setSortState }: SortableProps = $props();

    let filteredLockouts = $derived.by(() =>
        userState.general.homeLockouts.filter(
            (instanceDifficulty) =>
                wowthingData.static.instanceById.has(instanceDifficulty.instanceId) &&
                viewHasLockout(
                    settingsState.activeView,
                    instanceDifficulty.difficulty,
                    instanceDifficulty.instanceId
                )
        )
    );
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 5rem);
    }
</style>

{#each filteredLockouts as instanceDifficulty (instanceDifficulty)}
    {@const { difficulty, instanceId } = instanceDifficulty}
    {@const instance = wowthingData.static.instanceById.get(instanceId)}
    {@const sortKey = `${instanceId}-${difficulty?.id || 0}`}
    <td
        class="sortable sorted-{getSortState(sortKey)}"
        onclick={() => setSortState(sortKey)}
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
{/each}
