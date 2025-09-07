<script lang="ts">
    import { taskChoreMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons';
    import type { CharacterProps } from '@/types/props';
    import type { Task } from '@/types/tasks';
    import type { CharacterChore, CharacterTask } from '@/user-home/state/user/types/tasks.svelte';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    type Props = CharacterProps & {
        charChore?: CharacterChore;
        charTask?: CharacterTask;
        task: Task;
        taskName: string;
    };
    let { character, charChore, charTask, task, taskName }: Props = $props();

    let choreSets = $derived.by(() => {
        const ret: CharacterChore[][] = [];

        if (charChore) {
            ret.push([charChore]);
            //} else if (taskName === 'dfProfessionWeeklies') {
            //     taskSets.push(chore.tasks.slice(0, 1));
            //     const grouped = groupBy(chore.tasks.slice(1), (chore) => chore.name.split(' ')[0]);
            //     const keys = Object.keys(grouped);
            //     keys.sort();
            //     for (const key of keys) {
            //         taskSets.push(grouped[key]);
            //     }
        } else if (charTask) {
            let currentSet: CharacterChore[] = [];
            for (const chore of charTask.task.chores) {
                if (!chore) {
                    ret.push(currentSet);
                    currentSet = [];
                } else {
                    const charTaskChore = charTask.chores[chore.key];
                    if (charTaskChore && !charTaskChore.skipped) {
                        currentSet.push(charTaskChore);
                    }
                }
            }
            ret.push(currentSet);
        }

        return ret;
    });

    let anyErrors = $derived(
        choreSets.some((taskSet) =>
            taskSet.some(
                (task) =>
                    !!task &&
                    (task.status === QuestStatus.NotStarted || task.status === QuestStatus.Error) &&
                    task.name !== '' &&
                    task.statusTexts.some((st) => !!st)
            )
        )
    );

    const getFixedText = function (text: string): [string, string] {
        text = text.replace(/\[\[tier(\d)\]\]/, '{craftedQuality:$1}');

        let cls = '';
        const m = text.match(/^(\d+)\/(\d+) /);
        if (m) {
            const have = parseInt(m[1]);
            const total = parseInt(m[2]);
            const per = (have / total) * 100;
            if (per === 100) {
                cls = 'status-success';
            } else if (per > 0) {
                cls = 'status-shrug';
            }
        }
        return [text, cls];
    };
</script>

<style lang="scss">
    table {
        &:not(:last-child) {
            border-bottom: 1px solid var(--border-color);
        }

        + table {
            border-top: 1px solid var(--border-color);
            margin-top: 0.5rem;
        }
    }
    td {
        padding-top: 0.1rem;
        padding-bottom: 0.2rem;
    }
    .name {
        --image-border-width: 1px;

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
    <h5>{task?.name || `Unknown Task "${taskName}"`}</h5>

    {#each choreSets as choreSet (choreSet)}
        <table class="table-striped">
            <tbody>
                {#each choreSet as charTaskChore (charTaskChore)}
                    {@const chore = taskChoreMap[`${taskName}_${charTaskChore.key}`]}
                    <tr
                        class:skipped={!charChore &&
                            charTaskChore.skipped &&
                            charTaskChore.status !== QuestStatus.Error}
                    >
                        <td
                            class="name text-overflow"
                            class:status-shrug={charTaskChore.status === QuestStatus.Error}
                        >
                            <ParsedText text={charTaskChore.name} />
                        </td>
                        <td class="status">
                            <IconifyIcon
                                extraClass="status-{['fail', 'shrug', 'success', 'fail'][
                                    charTaskChore.status
                                ]}"
                                icon={chore?.icon ||
                                    [
                                        uiIcons.starEmpty,
                                        uiIcons.starHalf,
                                        uiIcons.starFull,
                                        uiIcons.lock,
                                    ][charTaskChore.status]}
                            />
                        </td>
                        {#if anyErrors}
                            <td class="error-text">
                                {#if charTaskChore.status === QuestStatus.Error}
                                    {charTaskChore.statusTexts[0]}
                                {/if}
                            </td>
                        {/if}
                    </tr>

                    {#if charTaskChore.status === QuestStatus.InProgress && charTaskChore.statusTexts[0]}
                        <tr class:skipped={charTaskChore.skipped}>
                            <td class="status-text" colspan={anyErrors ? 3 : 2}>
                                {#each charTaskChore.statusTexts as statusText}
                                    {@const [fixedText, textClass] = getFixedText(statusText)}
                                    <div>
                                        {#if !statusText.startsWith('<')}
                                            &ndash;
                                        {/if}
                                        <ParsedText cls={textClass} text={fixedText} />
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
