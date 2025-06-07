<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { staticStore } from '@/shared/stores/static';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { userStore } from '@/stores';
    import type { CharacterProps } from '@/types/props';

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte';

    let { character }: CharacterProps = $props();

    let filteredLockouts = $derived.by(() =>
        $userStore.homeLockouts.filter(
            (instanceDifficulty) =>
                $staticStore.instances[instanceDifficulty.instanceId] &&
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
