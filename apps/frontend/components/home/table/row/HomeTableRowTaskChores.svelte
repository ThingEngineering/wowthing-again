<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { multiTaskMap, taskMap } from '@/data/tasks'
    import { QuestStatus } from '@/enums'
    import { timeStore, userQuestStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte'

    export let character: Character
    export let taskName: string

    let chores: [string, number, string?][]
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
            if (choreTask.couldGetFunc?.(character) === false) {
                continue
            }

            countTotal++

            let status = 0
            let statusText = choreTask.canGetFunc?.(character) || ''
            if (statusText.startsWith('Need')) {
                status = 3
            }
            else if (choreTask.taskKey.endsWith('Drop#')) {
                const needCount = choreTask.taskName.match(/^(Herbalism|Mining|Skinning):/) ? 6 : 4
                let haveCount = 0
                for (let dropIndex = 0; dropIndex < needCount; dropIndex++) {
                    const dropKey = choreTask.taskKey.replace('#', (dropIndex + 1).toString())
                    const progressQuest = $userQuestStore.characters[character.id]?.progressQuests?.[dropKey]
                    if (progressQuest?.status === QuestStatus.Completed && DateTime.fromSeconds(progressQuest.expires) > $timeStore) {
                        haveCount++
                    }
                }

                if (haveCount === needCount) {
                    status = QuestStatus.Completed
                }
                else {
                    status = QuestStatus.InProgress
                    statusText = `${haveCount}/${needCount} Collected`
                }
            }
            else {
                const progressQuest = $userQuestStore.characters[character.id]?.progressQuests?.[choreTask.taskKey]
                if (!!progressQuest && DateTime.fromSeconds(progressQuest.expires) > $timeStore) {
                    status = progressQuest.status
                    if (status === QuestStatus.InProgress && progressQuest.objectives?.length > 0) {
                        statusText = progressQuest.objectives[0].text
                    }
                }
            }

            chores.push([
                taskName === 'dfDungeonWeeklies'
                    ? $userQuestStore.questNames[choreTask.taskKey] || choreTask.taskName
                    : choreTask.taskName,
                status,
                statusText,
            ])
            
            if (status === 2) {
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
