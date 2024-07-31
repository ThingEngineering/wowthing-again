<script lang="ts">
    import { activeView } from '@/shared/stores/settings'
    import { staticStore } from '@/shared/stores/static'
    import { userStore } from '@/stores'
    import type { Character } from '@/types'

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte'

    export let character: Character
</script>

{#each $userStore.homeLockouts as instanceDifficulty}
    {#if $activeView.homeLockouts.indexOf(instanceDifficulty.instanceId) >= 0 &&
        $staticStore.instances[instanceDifficulty.instanceId]}
        <RowLockout
            showNumbers={false}
            {character}
            {instanceDifficulty}
        />
    {/if}
{/each}
