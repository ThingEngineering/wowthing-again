<script lang="ts">
    import debounce from 'lodash/debounce';
    import xor from 'lodash/xor';

    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import type { Task } from '@/types/tasks';

    type Props = {
        task: Task;
        view: SettingsView;
    };
    let { task, view = $bindable() }: Props = $props();

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

<div class="multi-tasks">
    {#each taskChoices as choice (choice.id)}
        <GroupedCheckbox
            name="choice_{choice.id}"
            tooltip={choice.name}
            value={choice.id}
            bind:bindGroup={taskActive}
        >
            <ParsedText text={choice.name} />
        </GroupedCheckbox>
    {/each}
</div>
