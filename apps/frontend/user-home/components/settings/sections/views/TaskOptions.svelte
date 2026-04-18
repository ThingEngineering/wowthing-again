<script lang="ts">
    import debounce from 'lodash/debounce';
    import xor from 'lodash/xor';

    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';
    import type { Task } from '@/types/tasks';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    type Props = {
        task: Task;
        view: SettingsView;
    };
    let { task, view = $bindable() }: Props = $props();

    let taskFilter = $state<string>(view.choreFilters?.[task.key]);

    $effect(() => {
        (view.choreFilters ||= {})[task.key] = taskFilter;
    });

    const taskChoices: SettingsChoice[] = task.chores
        .filter((c) => !!c)
        .map((c) => ({ id: c.key, name: c.name }));

    let taskActive = $derived.by(() =>
        taskChoices
            .filter((choice) => (view.disabledChores[task.key] || []).indexOf(choice.id) === -1)
            .map((choice) => choice.id)
    );

    let taskInactive = $derived.by(() =>
        taskChoices
            .filter((choice) => taskActive.indexOf(choice.id) === -1)
            .map((choice) => choice.id)
    );

    $effect(() => onTaskChange(taskInactive));

    let lastKeys: string[] = [];
    const onTaskChange = debounce((keys: string[]) => {
        if (xor(lastKeys, keys).length > 0) {
            (view.disabledChores ||= {})[task.key] = keys;
            lastKeys = keys;
        }
    }, 250);
</script>

<style lang="scss">
    h3 {
        display: flex;
    }
    .filter-tasks {
        > div {
            align-items: center;
            display: flex;
            gap: 0.25rem;
            justify-content: space-between;
            width: 100%;

            :global(> fieldset:first-child) {
                flex: 9;
                height: 100%;
                margin: 0.1rem 0;
                padding: 1px 0;
            }
            :global(> fieldset:last-child) {
                flex: 4;
                margin: 0.1rem 0;
            }
            :global(> fieldset:last-child input) {
                padding-bottom: 0;
                padding-top: 0;
            }
        }
    }
    .multi-tasks {
        display: flex;
        flex-wrap: wrap;
        gap: 0 1rem;

        :global(fieldset) {
            min-width: 0;
            width: 14rem;
        }
    }
</style>

{#snippet choiceCheckbox(choice: SettingsChoice)}
    <GroupedCheckbox
        name="choice_{choice.id}"
        tooltip={choice.name}
        value={choice.id}
        bind:bindGroup={taskActive}
    >
        <ParsedText text={choice.name} />
    </GroupedCheckbox>
{/snippet}

<div class="settings-block">
    <h3>
        {task.name}
        <TextInput
            name="task_{task.key}_filter"
            placeholder="Character filter..."
            bind:value={taskFilter}
        />
    </h3>
    {#if taskFilter}
        <div class="filter-tasks">
            {#each taskChoices as choice (choice.id)}
                {@const choiceKey = `${task.key}_${choice.id}`}
                <div>
                    {@render choiceCheckbox(choice)}
                    {#if taskActive.includes(choice.id)}
                        <TextInput
                            name="task_{choiceKey}_filter"
                            placeholder={taskFilter}
                            bind:value={view.choreFilters[choiceKey]}
                        />
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <div class="multi-tasks">
            {#each taskChoices as choice (choice.id)}
                {@render choiceCheckbox(choice)}
            {/each}
        </div>
    {/if}
</div>
