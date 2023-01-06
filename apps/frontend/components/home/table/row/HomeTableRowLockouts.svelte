<script lang="ts">
    import { staticStore, userStore } from '@/stores'
    import type { Character } from '@/types'

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte'

    export let character: Character
</script>

{#each $userStore.homeLockouts as instanceDifficulty}
    {#if $staticStore.instances[instanceDifficulty.instanceId]}
        <RowLockout
            showNumbers={false}
            {character}
            {instanceDifficulty}
        />
    {/if}
{/each}
