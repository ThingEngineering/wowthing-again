<script lang="ts">
    import { taskChoreMap, taskMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { DbResetType } from '@/shared/stores/db/enums';
    import { userState } from '@/user-home/state/user';
    import type { CharacterChore } from '@/user-home/state/user/types/tasks.svelte';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import {
        MynauiLetterASquare,
        MynauiLetterDSquare,
        MynauiLetterWSquare,
    } from '@/shared/icons/components';

    type Props = {
        characterId: number;
        fullTaskName: string;
    };
    let { characterId, fullTaskName }: Props = $props();

    let [taskName, choreName] = $derived(fullTaskName.split('|', 2));
    let character = $derived(userState.general.characterById[characterId]);
    let task = $derived(taskMap[taskName] || settingsState.customTaskMap[taskName]);
    let charTask = $derived(userState.activeViewTasks[character?.id]?.[taskName]);
    let charChore = $derived(
        userState.activeViewTasks[character?.id]?.[fullTaskName]?.chores?.[choreName]
    );

    let choreSets = $derived.by(() => {
        const ret: CharacterChore[][] = [];

        if (charChore) {
            ret.push([charChore]);
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
        --scale: 1.2;

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
    <h4>{character?.name || `Unknown Character #${characterId}`}</h4>
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
                            {#if chore.questReset === DbResetType.Daily && settingsState.value.tasks.showDailyIcon}
                                <IconifyWrapper Icon={MynauiLetterDSquare} cls="quality3" />
                            {:else if chore.questReset === DbResetType.Weekly && settingsState.value.tasks.showWeeklyIcon}
                                <IconifyWrapper Icon={MynauiLetterWSquare} cls="quality3" />
                            {/if}
                            {#if chore.accountWide && settingsState.value.tasks.showAccountIcon}
                                <IconifyWrapper Icon={MynauiLetterASquare} cls="status-shrug" />
                            {/if}

                            <ParsedText text={charTaskChore.name} />
                        </td>
                        <td class="status">
                            <span
                                class="status-{['fail', 'shrug', 'success', 'fail'][
                                    charTaskChore.status
                                ]}"
                            >
                                {#if chore?.icon}
                                    {#if 'body' in chore.icon}
                                        <IconifyIcon icon={chore.icon} />
                                    {:else}
                                        <IconifyWrapper Icon={chore.icon} scale="1" />
                                    {/if}
                                {:else}
                                    <IconifyIcon
                                        icon={[
                                            uiIcons.starEmpty,
                                            uiIcons.starHalf,
                                            uiIcons.starFull,
                                            uiIcons.lock,
                                        ][charTaskChore.status]}
                                    />
                                {/if}
                            </span>
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

    {#if settingsState.value.tasks.showIconLegend}
        <div class="bottom" style:--scale="1.2">
            <span>
                <IconifyWrapper Icon={MynauiLetterDSquare} cls="quality3" /> Daily
            </span>
            <span>
                <IconifyWrapper Icon={MynauiLetterWSquare} cls="quality3" /> Weekly
            </span>
            <span>
                <IconifyWrapper Icon={MynauiLetterASquare} cls="status-shrug" /> Account
            </span>
        </div>
    {/if}
</div>
