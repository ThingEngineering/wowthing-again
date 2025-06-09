<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { homeState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';

    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte';

    let { sortKey }: { sortKey: string } = $props();

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

{#each filteredLockouts as { difficulty, instanceId } (`${difficulty}|${instanceId}`)}
    {@const instance = wowthingData.static.instanceById.get(instanceId)}
    {@const sortField = `lockout:${instanceId}-${difficulty?.id || 0}`}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        onclick={() => setSorting(sortField)}
        onkeypress={() => setSorting(sortField)}
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
