<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import type { Character } from '@/types'

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte'

    export let character: Character
</script>

{#each $settings.layout.homeLockouts as instanceId}
    <RowLockout
        {character}
        instanceDifficulty={$userStore.data.allLockoutsMap[`${instanceId}-0`]}
        showNumbers={false}
    />
{/each}
