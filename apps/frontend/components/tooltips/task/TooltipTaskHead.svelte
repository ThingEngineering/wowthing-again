<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantMap } from '@/data/covenant'
    import { progressQuestMap } from '@/data/quests'
    import { multiTaskMap, taskMap } from '@/data/tasks'
    import { QuestStatus } from '@/enums/quest-status'
    import { activeView } from '@/shared/stores/settings'
    import { timeStore } from '@/shared/stores/time'
    import { lazyStore, userQuestStore, userStore } from '@/stores'
    
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'

    export let taskName: string

    let completed: number
    let disabledChores: string[]
    let inProgress: number
    let multiStats: [string, string, Record<QuestStatus, number>][]
    let needToGet: number
    let total: number
    let title: string
    $: {
        completed = 0
        inProgress = 0
        total = 0

        const questName = progressQuestMap[taskName] || taskName
        const task = taskMap[taskName]
        disabledChores = $activeView.disabledChores?.[taskName] || []
        
        const multiMap: Record<string, number> = {}
        multiStats = []
        if (task.type === 'multi' && taskName !== 'dfProfessionWeeklies') {
            multiStats = sortBy(
                multiTaskMap[taskName],
                (multiTask) => disabledChores.indexOf(multiTask.taskKey) >= 0
            ).map((multi) => [multi.taskKey, multi.taskName, { 0: 0, 1: 0, 2: 0, 3: 0 }])

            for (let i = 0; i < multiStats.length; i++) {
                multiMap[multiStats[i][1]] = i
            }
        }

        // Check other characters for a quest title
        for (const characterId in $userQuestStore.characters) {
            const character = $userStore.characterMap[characterId]
            if (!character) {
                continue
            }

            if (
                character.level >= (task?.minimumLevel || Constants.characterMaxLevel) &&
                character.level <= (task?.maximumLevel || Constants.characterMaxLevel) &&
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
                    const taskChores = charChores?.[`${$activeView.id}|${taskName}`]

                    if (taskName !== 'dfProfessionWeeklies') {
                        for (const choreTask of (taskChores?.tasks || [])) {
                            multiStats[multiMap[choreTask.name]][2][choreTask.status]++
                        }
                    }

                    total += (taskChores?.countTotal || 0)
                    completed += (taskChores?.countCompleted || 0)
                    inProgress += (taskChores?.countStarted || 0)
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
        --image-border-width: 1px;

        text-align: left;
    }
    .faded {
        opacity: 0.7;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{title}</h4>
    <table class="table-striped">
        <tbody>
            {#each multiStats as [multiTaskKey, multiTaskName, questStatuses]}
                {@const disabled = disabledChores.indexOf(multiTaskKey) >= 0}
                {#if !disabled || questStatuses[1] > 0 || questStatuses[2] > 0}
                    <tr
                        class:faded={disabled}
                    >
                        <td class="value">
                            <ParsedText text={multiTaskName} />
                        </td>
                        <td class="label drop-shadow status-fail">{questStatuses[0]}</td>
                        <td class="label drop-shadow status-shrug">{questStatuses[1]}</td>
                        <td class="label drop-shadow status-success">{questStatuses[2]}</td>
                    </tr>
                {/if}
            {:else}
                <tr>
                    <td class="label status-success">Completed:</td>
                    <td class="value drop-shadow">{completed}</td>
                </tr>
                {#if inProgress > 0}
                    <tr>
                        <td class="label status-shrug">In progress:</td>
                        <td class="value drop-shadow">{inProgress}</td>
                    </tr>
                {/if}
                {#if needToGet > 0}
                    <tr>
                        <td class="label status-fail">Not started:</td>
                        <td class="value drop-shadow">{needToGet}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>
