<script lang="ts">
    import xor from 'lodash/xor';

    import { Constants, MAX_TASKS } from '@/data/constants';
    import {
        MynauiLetterASquare,
        MynauiLetterDSquare,
        MynauiLetterWSquare,
    } from '@/shared/icons/components';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { DbResetType } from '@/shared/stores/db/enums';
    import type { SettingsTask } from '@/shared/stores/settings/types/task';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Select from '@/shared/components/forms/Select.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let currentIds = $derived.by(() =>
        (settingsState.value.customTasks || []).map((task) => task.key)
    );

    let taskQuestIds = $state<Record<string, string>>(
        Object.fromEntries(
            settingsState.value.customTasks.map((task) => [task.key, task.questIds.join(' ')])
        )
    );

    $effect(() => {
        for (const [key, questIdString] of Object.entries(taskQuestIds)) {
            const task = settingsState.value.customTasks.find((task) => task.key === key);
            if (task) {
                const questIds = questIdString
                    .split(/ +/)
                    .map((s) => parseInt(s))
                    .filter((n) => !isNaN(n));
                questIds.sort();
                if (xor(questIds, task.questIds || []).length > 0) {
                    task.questIds = questIds;
                }
            }
        }
    });

    const newTask = () => {
        const task: SettingsTask = {
            key: `custom:${crypto.randomUUID()}`,
            name: 'New Task',
            questIds: [],
            questReset: DbResetType.Weekly,
            shortName: 'ZZ',
        };

        settingsState.value.customTasks.push(task);
    };
</script>

<style lang="scss">
    div {
        --image-margin-top: -4px;
    }
    .task-tooltips {
        --scale: 1.2;
    }
    table {
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid var(--border-color);
    }
    button {
        cursor: pointer;
        margin-top: 0.75rem;
    }
    .name {
        --width: 12rem;
    }
    .short-name {
        --width: 4rem;
    }
    .quest-reset {
        --width: 6rem;
    }
    .quest-ids {
        --width: 10rem;
    }
</style>

<div class="settings-block">
    <h3>Tooltips</h3>

    <div class="task-tooltips">
        <CheckboxInput
            name="tasks_show_icon_legend"
            bind:value={settingsState.value.tasks.showIconLegend}
            >Show icon legend at bottom of tooltip</CheckboxInput
        >

        <CheckboxInput
            name="tasks_show_account_icon"
            bind:value={settingsState.value.tasks.showAccountIcon}
        >
            <IconifyWrapper Icon={MynauiLetterASquare} cls="status-shrug" />
            Show account icon
        </CheckboxInput>

        <CheckboxInput
            name="tasks_show_daily_icon"
            bind:value={settingsState.value.tasks.showDailyIcon}
        >
            <IconifyWrapper Icon={MynauiLetterDSquare} cls="quality3" />
            Show daily icon
        </CheckboxInput>

        <CheckboxInput
            name="tasks_show_weekly_icon"
            bind:value={settingsState.value.tasks.showWeeklyIcon}
        >
            <IconifyWrapper Icon={MynauiLetterWSquare} cls="quality3" />
            Show weekly icon
        </CheckboxInput>
    </div>

    <h3>Custom Tasks</h3>

    <p>
        Create custom tasks to use in Views. Quest IDs is a space-separated list of numbers like
        "1234 5678". Min/Max are character level, 0 actually means {Constants.characterMaxLevel} so tasks
        will only work for max level characters if you don't set anything.
    </p>

    <p>
        To use an arbitrary game icon as the "Short" text use
        <code>{'{image:item/12345}'}</code> to get <ParsedText text={'{image:item/12345}'} /> (or
        <code>achievement/12345</code>, <code>currency/1234</code>, <code>spell/12345</code>)
    </p>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>Name</th>
                <th>Short</th>
                <th>Reset</th>
                <th>Quest IDs</th>
                <th>Min</th>
                <th>Max</th>
            </tr>
        </thead>
        <tbody>
            {#each settingsState.value.customTasks as task (task.key)}
                <tr>
                    <td class="name">
                        <TextInput maxlength={25} name="task_name" bind:value={task.name} />
                    </td>
                    <td class="short-name">
                        <TextInput
                            maxlength={25}
                            name="task_short_name"
                            bind:value={task.shortName}
                        />
                    </td>
                    <td class="quest-reset">
                        <Select
                            name="task_quest_reset"
                            bind:selected={task.questReset}
                            options={[
                                [DbResetType.Daily, 'Daily'],
                                [DbResetType.Weekly, 'Weekly'],
                                [DbResetType.Never, 'Never'],
                            ]}
                        />
                    </td>
                    <td class="quest-ids">
                        <TextInput
                            maxlength={100}
                            name="task_quest_ids"
                            bind:value={taskQuestIds[task.key]}
                        />
                    </td>
                    <td class="level">
                        <NumberInput
                            name="minimum_level"
                            minValue={0}
                            maxValue={80}
                            bind:value={task.minimumLevel}
                        />
                    </td>
                    <td class="level">
                        <NumberInput
                            name="maximum_level"
                            minValue={0}
                            maxValue={80}
                            bind:value={task.maximumLevel}
                        />
                    </td>
                </tr>
            {:else}
                <tr>
                    <td class="name">No tasks!</td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if currentIds.length < MAX_TASKS}
        <button class="group-entry bg-success border b-success b-radius" onclick={newTask}
            >New Task</button
        >
    {/if}
</div>
