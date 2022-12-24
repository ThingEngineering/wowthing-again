<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { multiTaskMap, taskMap } from '@/data/tasks'
    import { timeStore, userQuestStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte'

    export let character: Character
    export let taskName: string

    let chores: [string, boolean][]
    let countCompleted: number
    let countTotal: number
    $: {
        chores = []
        if (character.level < (taskMap[taskName].minimumLevel || Constants.characterMaxLevel)) {
            break $
        }

        countCompleted = 0
        countTotal = 0
        for (const choreTask of multiTaskMap[taskName]) {
            if (character.level < (choreTask.minimumLevel || Constants.characterMaxLevel)) {
                continue
            }

            countTotal++

            let completed = false
            const progressQuest = $userQuestStore.data.characters[character.id]?.progressQuests?.[choreTask.taskKey]
            if (progressQuest) {
                completed = progressQuest.status === 2 && DateTime.fromSeconds(progressQuest.expires) > $timeStore
            }
            chores.push([choreTask.taskName, completed])

            if (completed) {
                countCompleted++
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        text-align: center;
        word-spacing: -0.2ch;
    }
</style>

{#if chores.length > 0}
    <td
        class:status-fail={countCompleted === 0}
        class:status-shrug={countCompleted < countTotal}
        class:status-success={countCompleted === countTotal}
        use:tippyComponent={{
            component: Tooltip,
            props: {
                character,
                chores,
                taskName,
            },
        }}
    >
        {countCompleted} / {countTotal}
    </td>
{:else}
    <td></td>
{/if}
