<script lang="ts">
    import { staticStore, userStore } from '@/stores'
    import type { Difficulty } from '@/types'
    import type { StaticDataInstance } from '@/types/data/static'

    export let difficulty: Difficulty
    export let instanceId: number

    let count: number
    let instance: StaticDataInstance
    $: {
        count = 0
        instance = $staticStore.data.instances[instanceId]

        if (difficulty && instance) {
            const difficultyKey = `${instance.id}-${difficulty.id}`

            for (const character of $userStore.data.characters) {
                const lockout = character.lockouts?.[difficultyKey]
                if (lockout) {
                    count++
                }
            }
        }
    }
</script>

<div class="wowthing-tooltip">
    <h4 class="no-border">{instance?.name ?? `Unknown instance #${instanceId}`}</h4>

    {#if difficulty}
        <h5>{difficulty.name}</h5>
    {/if}

    <table class="table-tooltip-lockout table-striped">
        <tbody>
            <tr>
                <td>{count} character{count === 1 ? '' : 's'} have lockouts</td>
            </tr>
        </tbody>
    </table>
</div>
