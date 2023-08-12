<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantMap } from '@/data/covenant'
    import { progressQuestMap } from '@/data/quests'
    import { taskMap } from '@/data/tasks'
    import { QuestStatus } from '@/enums'
    import { lazyStore, timeStore, userQuestStore, userStore } from '@/stores'
    
    export let taskName: string

    let completed: number
    let inProgress: number
    let needToGet: number
    let total: number
    let title: string
    $: {
        completed = 0
        inProgress = 0
        total = 0

        const questName = progressQuestMap[taskName] || taskName
        const task = taskMap[taskName]

        // Check other characters for a quest title
        for (const characterId in $userQuestStore.characters) {
            const character = $userStore.characterMap[characterId]
            if (!character) {
                continue
            }

            if (
                character.level >= (task?.minimumLevel || Constants.characterMaxLevel) &&
                (
                    !task?.requiredQuestId ||
                    $userQuestStore.characters[character.id]?.quests?.has(task.requiredQuestId)
                )
            ) {
                let oofName = questName
                if (questName === 'slAnima') {
                    const covenant = covenantMap[character.shadowlands?.covenantId]
                    if (covenant) {
                        oofName = `${covenant.slug.replace('-fae', 'Fae')}Anima`
                    }
                }

                if (task.type === 'multi') {
                    const { chores: charChores } = $lazyStore.characters[characterId]
                    const taskChores = charChores?.[taskName]

                    total += taskChores.countTotal
                    completed += taskChores.countCompleted
                    inProgress += taskChores.countStarted
                    
                    //console.log({charChores, charTasks})
                    // for (const multiTask of multiTaskMap[taskName]) {
                    //     if (multiTask?.couldGetFunc(character) === false) {
                    //         continue
                    //     }
                    //     console.log(multiTask)
                    // }
                }
                else {
                    total++

                    const characterQuest = $userQuestStore.characters[characterId]?.progressQuests?.[oofName]
                    if (characterQuest) {
                        if (questName === 'weeklyHoliday' && DateTime.fromSeconds(characterQuest.expires) < $timeStore) {
                            continue
                        }

                        title = characterQuest.name

                        if (characterQuest.status === QuestStatus.InProgress) {
                            inProgress++
                        }
                        else if (characterQuest.status === QuestStatus.Completed) {
                            completed++
                        }
                    }
                }
            }
        }

        needToGet = total - inProgress - completed

        // Use the fallback title
        if (!title) {
            title = task?.name
        }
    }
</script>

<style lang="scss">
    .label {
        text-align: right;
    }
    .value {
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{title}</h4>
    <table class="table-striped">
        <tbody>
            <tr>
                <td class="label status-success">Completed:</td>
                <td class="value">{completed}</td>
            </tr>
            {#if inProgress > 0}
                <tr>
                    <td class="label status-shrug">In progress:</td>
                    <td class="value">{inProgress}</td>
                </tr>
            {/if}
            {#if needToGet > 0}
                <tr>
                    <td class="label status-fail">Not started:</td>
                    <td class="value">{needToGet}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
