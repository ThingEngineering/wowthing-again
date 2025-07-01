<script lang="ts">
    import xor from 'lodash/xor';

    import { Constants } from '@/data/constants';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { DbResetType } from '@/shared/stores/db/enums';
    import type { SettingsTask } from '@/shared/stores/settings/types/task';

    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Select from '@/shared/components/forms/Select.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

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
    table {
        --image-margin-top: -4px;
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid var(--border-color);
    }
    button {
        background: darken($color-success, 40%);
        border: 1px solid darken($color-success, 20%);
        border-radius: var(--border-radius);
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
    <UnderConstruction />

    <h3>Tasks</h3>

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
                <tr class="sized">
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

    {#if currentIds.length < 10}
        <button class="group-entry" onclick={newTask}>New Task</button>
    {/if}
</div>
