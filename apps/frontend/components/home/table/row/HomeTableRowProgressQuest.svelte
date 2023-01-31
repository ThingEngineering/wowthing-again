<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantMap } from '@/data/covenant'
    import { forcedReset, progressQuestMap } from '@/data/quests'
    import { taskMap } from '@/data/tasks'
    import { timeStore, userQuestStore, userStore } from '@/stores'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress } from '@/types/data'

    import Tooltip from '@/components/tooltips/progress-quest/TooltipProgressQuest.svelte'

    export let character: Character
    export let quest: string

    $: activeHoliday = getActiveHoliday($userStore, character.realm.region)

    let actualQuest: string
    let highlight: boolean
    let progressQuest: UserQuestDataCharacterProgress
    let status: string
    let text: string
    let title: string
    let valid: boolean
    $: {
        highlight = false
        valid = false
        const task = taskMap[quest]
        if (
            character.level >= (task?.minimumLevel || Constants.characterMaxLevel) &&
            (
                !task?.requiredQuestId ||
                $userQuestStore.characters[character.id]?.quests?.has(task.requiredQuestId)
            )
        ) {
            actualQuest = quest
            valid = true

            if (quest === 'slAnima') {
                const covenant = covenantMap[character.shadowlands?.covenantId]
                if (covenant) {
                    actualQuest = `${covenant.slug.replace('-fae', 'Fae')}Anima`
                }
            }
            else {
                actualQuest = progressQuestMap[quest] || quest
            }

            // Check other characters for a quest title
            for (const characterId in $userQuestStore.characters) {
                const characterQuest = $userQuestStore.characters[characterId]?.progressQuests?.[actualQuest]
                if (characterQuest) {
                    if (actualQuest === 'weeklyHoliday' && DateTime.fromSeconds(characterQuest.expires) < $timeStore) {
                        continue
                    }

                    title = characterQuest.name
                    break
                }
            }

            // Use the fallback title
            if (title === undefined) {
                title = actualQuest === 'weeklyHoliday' ? taskMap[activeHoliday]?.name : taskMap[actualQuest]?.name
            }

            progressQuest = $userQuestStore.characters[character.id]?.progressQuests?.[actualQuest]
            if (progressQuest) {
                const expires: DateTime = DateTime.fromSeconds(progressQuest.expires)

                //const resetTime = getNextWeeklyReset(character.weekly.ughQuestsScannedAt, character.realm.region)
                if (forcedReset[actualQuest]) {
                    // quest always resets even if incomplete
                    if (expires < $timeStore) {
                        progressQuest.status = 0
                    }
                }
                else {
                    // quest was completed and it's a new week
                    if (progressQuest.status === 2 && expires < $timeStore) {
                        progressQuest.status = 0
                    }
                }

                if (progressQuest.status === 2) {
                    status = 'success'
                    text = 'Done'
                }
                else if (progressQuest.status === 1) {
                    status = 'shrug'
                    
                    const objectives = progressQuest.objectives || []
                    if (objectives.length === 1) {
                        const objective = progressQuest.objectives[0]
                        if (objective.type === 'progressbar') {
                            text = `${objective.have} %`
                        }
                        else if (actualQuest === 'weeklyHoliday' || actualQuest === 'weeklyPvp') {
                            text = `${objective.have} / ${objective.need}`
                        }
                        else {
                            text = `${Math.floor(objective.have / objective.need * 100)} %`
                        }

                        if (objective.have === objective.need) {
                            status = `${status} status-turn-in`
                        }
                    }
                    else {
                        const averagePercent = objectives
                            .reduce((a, b) => (a + (b.have / b.need)), 0) / objectives.length

                        text = `${Math.floor(averagePercent * 100)} %`

                        if (averagePercent >= 100) {
                            status = `${status} status-turn-in`
                        }
                    }
                }
            }

            if (status === undefined) {
                status = 'fail'
                text = 'Get!'
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        word-spacing: -0.2ch;

        &.center {
            text-align: center !important;
        }

        &.status-shrug {
            text-align: right;
        }

        &.status-turn-in {
            color: rgb(255, 0, 255);
        }

        &.highlight {
            background: darken($colour-shrug, 35%);
        }
    }

    @keyframes shrug-success {
        0% {
            color: $colour-fail;
        }
        100% {
            color: $colour-shrug;
        }
    }
</style>

{#if valid}
    <td
        class="status-{status}"
        class:center={actualQuest === 'weeklyHoliday' || progressQuest?.status !== 1}
        class:highlight
        use:tippyComponent={{
            component: Tooltip,
            props: {
                character,
                progressQuest,
                title,
            }
        }}
    >{text}</td>
{:else}
    <td>&nbsp;</td>
{/if}
