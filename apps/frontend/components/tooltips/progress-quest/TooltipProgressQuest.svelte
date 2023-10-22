<script lang="ts">
    import { DateTime } from 'luxon'

    import { forcedReset } from '@/data/quests'
    import { timeStore } from '@/stores'
    import { QuestStatus } from '@/enums/quest-status'
    import { toNiceDuration } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress, UserQuestDataCharacterProgressObjective } from '@/types/data'

    export let character: Character
    export let progressQuest: UserQuestDataCharacterProgress
    export let title: string

    let duration: string
    let status: QuestStatus
    $: {
        status = progressQuest?.status ?? QuestStatus.NotStarted
        const isForcedReset = forcedReset[progressQuest?.objectives?.[0]?.type]
        if (progressQuest && (progressQuest.status === QuestStatus.Completed || isForcedReset)) {
            const expires = DateTime.fromSeconds(progressQuest.expires)
            duration = toNiceDuration(expires.diff($timeStore).toMillis())
        }
    }

    const objectiveStatus = function(objective: UserQuestDataCharacterProgressObjective): number {
        if (objective.have < objective.need) {
            return 1
        }
        return 2
    }
</script>

<style lang="scss">
    table {
        td {
            padding: 0.25rem 0.5rem;
        }
    }
    .status-0 {
        color: $color-fail;
    }
    .status-1 {
        color: $color-shrug;
    }
    .status-2 {
        color: $color-success;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{progressQuest?.name || title}</h5>

    <table class="table-striped">
        <tbody>
            {#if status === QuestStatus.InProgress && progressQuest.objectives?.length > 0}
                {#each progressQuest.objectives as objective}
                    <tr>
                        <td class="progress status-{objectiveStatus(objective)}">
                            {objective.text}
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td class="progress status-{status === QuestStatus.Completed ? '2' : '0'}">
                        {#if status === QuestStatus.InProgress}
                            Update addon!
                        {:else if status === QuestStatus.NotStarted}
                            Quest not started!
                        {:else if status === QuestStatus.Completed}
                            Quest completed
                        {/if}
                    </td>
                </tr>
            {/if}

            {#if duration}
                <tr>
                    <td class="duration">Resets in {@html duration}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
