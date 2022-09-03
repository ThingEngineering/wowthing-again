<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantMap } from '@/data/covenant'
    import { forcedReset, progressQuestMap } from '@/data/quests'
    import { taskMap } from '@/data/tasks'
    import { timeStore, userQuestStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress } from '@/types/data'

    import Tooltip from '@/components/tooltips/progress-quest/TooltipProgressQuest.svelte'

    export let character: Character
    export let quest: string

    let progressQuest: UserQuestDataCharacterProgress
    let status: string
    let text: string
    let title: string
    let valid: boolean
    $: {
        valid = false
        const task = taskMap[quest]
        if (
            character.level >= (task?.minimumLevel || Constants.characterMaxLevel) &&
            (
                !task?.requiredQuestId ||
                $userQuestStore.data.characters[character.id]?.quests?.has(task.requiredQuestId)
            )
        ) {
            console.log(task)
            valid = true

            if (quest === 'slAnima') {
                const covenant = covenantMap[character.shadowlands?.covenantId]
                if (covenant) {
                    quest = `${covenant.slug.replace('-fae', 'Fae')}Anima`
                }
            }
            else {
                quest = progressQuestMap[quest] || quest
            }

            // Check other characters for a quest title
            for (const characterId in $userQuestStore.data.characters) {
                const characterQuest = $userQuestStore.data.characters[characterId]?.progressQuests?.[quest]
                if (characterQuest) {
                    if (quest === 'weeklyHoliday' && DateTime.fromSeconds(characterQuest.expires) < $timeStore) {
                        continue
                    }

                    title = characterQuest.name
                    break
                }
            }

            // Use the fallback title
            if (title === undefined) {
                title = taskMap[quest]?.name
            }

            progressQuest = $userQuestStore.data.characters[character.id]?.progressQuests?.[quest]
            if (progressQuest) {
                const expires: DateTime = DateTime.fromSeconds(progressQuest.expires)

                //const resetTime = getNextWeeklyReset(character.weekly.ughQuestsScannedAt, character.realm.region)
                if (forcedReset[quest]) {
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

                    if (progressQuest.type === 'progressbar') {
                        text = `${progressQuest.have} %`
                    }
                    else if (quest === 'weeklyHoliday' || quest === 'weeklyPvp') {
                        text = `${progressQuest.have} / ${progressQuest.need}`
                    }
                    else {
                        text = `${Math.floor(progressQuest.have / progressQuest.need * 100)} %`
                    }

                    if (progressQuest.have === progressQuest.need) {
                        status = `${status} shrug-cycle`
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

        &.shrug-cycle {
            animation: 2s linear 0s infinite alternate shrug-success;
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
        class:center={quest === 'weeklyHoliday' || progressQuest === undefined || progressQuest.status !== 1}
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
