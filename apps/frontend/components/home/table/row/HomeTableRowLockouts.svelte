<script lang="ts">
    import { userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
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
