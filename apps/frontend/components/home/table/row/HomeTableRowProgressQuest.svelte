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
                $userQuestStore.data.characters[character.id]?.quests?.has(task.requiredQuestId)
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
            for (const characterId in $userQuestStore.data.characters) {
                const characterQuest = $userQuestStore.data.characters[characterId]?.progressQuests?.[actualQuest]
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
                title = taskMap[actualQuest]?.name
            }

            progressQuest = $userQuestStore.data.characters[character.id]?.progressQuests?.[actualQuest]
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

                    if (progressQuest.objectives?.length === 1) {
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
                            status = `${status} shrug-cycle`
                        }
                    }
                    else {
                        let have = 0
                        let need = 0
                        for (const objective of (progressQuest.objectives || [])) {
                            have += objective.have
                            need += objective.need
                        }

                        text = `${Math.floor(have / need * 100)} %`

                        if (have === need) {
                            status = `${status} shrug-cycle`
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

        &.shrug-cycle {
            animation: 2s linear 0s infinite alternate shrug-success;
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
