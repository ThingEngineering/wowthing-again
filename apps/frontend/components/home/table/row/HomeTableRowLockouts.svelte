<script lang="ts">
    import { lockoutDifficultyOrder } from '@/data/difficulty'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import type { Character, InstanceDifficulty } from '@/types'

    import RowLockout from '@/components/lockouts/LockoutsTableRowLockout.svelte'

    export let character: Character

    let lockouts: InstanceDifficulty[]
    $: {
        lockouts = []
        for (const instanceId of $settings.layout.homeLockouts) {
            let id: InstanceDifficulty
            for (const difficulty of lockoutDifficultyOrder) {
                id = $userStore.data.allLockoutsMap[`${instanceId}-${difficulty}`]
                if (id !== undefined) {
                    break
                }
            }
            lockouts.push(id)
        }
    }
</script>

{#each lockouts as instanceDifficulty}
    <RowLockout
        showNumbers={false}
        {character}
        {instanceDifficulty}
    />
{/each}
