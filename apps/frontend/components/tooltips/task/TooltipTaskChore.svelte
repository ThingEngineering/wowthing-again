<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'

    import { iconStrings } from '@/data/icons'
    import { taskMap } from '@/data/tasks'
    import { QuestStatus } from '@/enums/quest-status'
    import type { LazyCharacterChore, LazyCharacterChoreTask } from '@/stores/lazy/character'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

    export let character: Character
    export let chore: LazyCharacterChore
    export let taskName: string

    let anyErrors: boolean
    let taskSets: Array<LazyCharacterChoreTask[]>
    $: {
        taskSets = []

        if (taskName === 'dfProfessionWeeklies') {
            taskSets.push(chore.tasks.slice(0, 1))

            const grouped = groupBy(chore.tasks.slice(1), (chore) => chore.name.split(' ')[0])
            const keys = Object.keys(grouped)
            keys.sort()
            for (const key of keys) {
                taskSets.push(grouped[key])
            }
        }
        else {
            taskSets.push(chore.tasks)
        }

        anyErrors = some(
            taskSets,
            (taskSet) => some(
                taskSet,
                (task) => (
                    task.status === QuestStatus.NotStarted ||
                    task.status === QuestStatus.Error
                )
                && task.name !== ''
                && some(task.statusTexts, (st) => !!st)
            )
        )
    }

    const getFixedText = function(text: string): [string, string] {
        text = text.replace(/\[\[tier(\d)\]\]/, '{craftedQuality:$1}')
        
        let cls = ''
        const m = text.match(/^(\d+)\/(\d+) /)
        if (m) {
            const have = parseInt(m[1])
            const total = parseInt(m[2])
            const per = have / total * 100
            if (per === 100) {
                cls = 'status-success'
            }
            else if (per > 0) {
                cls = 'status-shrug'
            }
        }
        return [text, cls]
    }
</script>

<style lang="scss">
    table {
        &:not(:last-child) {
            border-bottom: 1px solid $border-color;
        }

        + table {
            border-top: 1px solid $border-color;
            margin-top: 0.5rem;
        }
    }
    td {
        padding-top: 0.1rem;
        padding-bottom: 0.2rem;
    }
    .name {
        direction: rtl; // not happy with this but ugh
        max-width: 15rem;
        min-width: 11rem;
        text-align: left;
        white-space: nowrap;
    }
    .status {
        //padding-left: 0;
        //padding-right: 0;
        text-align: center;
        width: 1rem;
    }
    .error-text {
        font-size: 0.95rem;
        text-align: left;
        width: 7rem;
    }
    .status-text {
        color: #afffff;
        font-size: 0.95rem;
        padding-left: 0.7rem;
        text-align: left;

        :global(svg) {
            margin-left: -0.5rem;
        }
    }
    .skipped {
        opacity: 0.7;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{taskMap[taskName].name}</h5>

    {#each taskSets as taskSet}
        <table class="table-striped">
            <tbody>
                {#each taskSet as charTask}
                    <tr
                        class:skipped={charTask.skipped && charTask.status !== QuestStatus.Error}
                    >
                        <td
                            class="name text-overflow"
                            class:status-shrug={charTask.status === QuestStatus.Error}
                        >
                            <ParsedText text={charTask.name.replace(/^\[.*?\] /, '')} />
                        </td>
                        <td class="status">
                            <IconifyIcon
                                extraClass="status-{['fail', 'shrug', 'success', 'fail'][charTask.status]}"
                                icon={iconStrings[['starEmpty', 'starHalf', 'starFull', 'lock'][charTask.status]]}
                            />
                        </td>
                        {#if anyErrors}
                            <td class="error-text">
                                {#if charTask.status === QuestStatus.Error}
                                    {charTask.statusTexts[0]}
                                {/if}
                            </td>
                        {/if}
                    </tr>

                    {#if charTask.status === QuestStatus.InProgress && charTask.statusTexts[0]}
                        <tr
                            class:skipped={charTask.skipped}
                        >
                            <td
                                class="status-text"
                                colspan="{anyErrors ? 3 : 2}"
                            >
                                {#each charTask.statusTexts as statusText}
                                    {@const [fixedText, textClass] = getFixedText(statusText)}
                                    <div>
                                        {#if !statusText.startsWith('<')}
                                            &ndash;
                                        {/if}
                                        <ParsedText
                                            cls={textClass}
                                            text={fixedText} />
                                    </div>
                                {/each}
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    {/each}
</div>
