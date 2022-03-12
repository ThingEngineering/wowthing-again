<script lang="ts">
    import { DateTime } from 'luxon'

    import { forcedReset } from '@/data/quests'
    import { timeStore } from '@/stores'
    import { QuestStatus } from '@/types/enums'
    import { toNiceDuration } from '@/utils/to-nice'
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress } from '@/types/data'

    export let character: Character
    export let progressQuest: UserQuestDataCharacterProgress
    export let title: string

    let duration: string
    $: {
        if (progressQuest && (progressQuest.status === QuestStatus.Completed || forcedReset[progressQuest.type])) {
            const expires = DateTime.fromSeconds(progressQuest.expires)
            duration = toNiceDuration(expires.diff($timeStore)?.toMillis() ?? '')
        }
    }
</script>

<style lang="scss">
    table {
        td,
        th {
            padding: 0.25rem 0.5rem;
        }

        th {
            font-weight: normal;
        }
    }
    .status-0 {
        color: $colour-fail;
    }
    .status-1 {
        color: $colour-shrug;
    }
    .status-2 {
        color: $colour-success;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>

    <table class="table-striped">
        <tbody>
            <tr>
                <td class="title">{progressQuest?.name ?? title}</td>
            </tr>
            <tr>
                <td class="progress status-{progressQuest?.status ?? 0}">
                    {#if progressQuest === undefined || progressQuest.status === QuestStatus.NotStarted}
                        Quest not started!
                    {:else}
                        {#if progressQuest.status === QuestStatus.InProgress}
                            {progressQuest.text}
                        {:else if progressQuest.status === QuestStatus.Completed}
                            Quest completed
                        {/if}
                    {/if}
                </td>
            </tr>

            {#if duration}
                <tr>
                    <td class="duration">Resets in {duration}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
