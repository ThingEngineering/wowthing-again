<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { userState } from '@/user-home/state/user';
    import type { CharacterProps } from '@/types/props';

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte';

    let { character }: CharacterProps = $props();

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

{#each filteredLockouts as instanceDifficulty (instanceDifficulty)}
    <RowLockout showNumbers={false} {character} {instanceDifficulty} />
{/each}
