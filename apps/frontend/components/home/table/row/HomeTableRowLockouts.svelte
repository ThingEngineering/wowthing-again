<script lang="ts">
    import { activeView } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import { viewHasLockout } from '@/shared/utils/view-has-lockout';
    import { userStore } from '@/stores';
    import type { Character } from '@/types';

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte';

    export let character: Character;
</script>

{#each $userStore.homeLockouts as instanceDifficulty}
    {@const instance = $staticStore.instances[instanceDifficulty.instanceId]}
    {#if instance && viewHasLockout($activeView, instanceDifficulty.difficulty, instanceDifficulty.instanceId)}
        <RowLockout showNumbers={false} {character} {instanceDifficulty} />
    {/if}
{/each}
