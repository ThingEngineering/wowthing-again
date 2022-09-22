<script lang="ts">
    import { userStore } from '@/stores'
    import type { Character } from '@/types'

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte'

    export let character: Character
</script>

{#each $userStore.data.homeLockouts as instanceDifficulty}
    <RowLockout
        showNumbers={false}
        {character}
        {instanceDifficulty}
    />
{/each}
