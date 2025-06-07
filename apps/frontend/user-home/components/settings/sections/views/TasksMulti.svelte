<script lang="ts">
    import debounce from 'lodash/debounce';
    import xor from 'lodash/xor';

    import { multiTaskMap } from '@/data/tasks';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    let { multiTaskKey, view = $bindable() }: { multiTaskKey: string; view: SettingsView } =
        $props();

    const taskChoices: SettingsChoice[] = multiTaskMap[multiTaskKey]
        .filter((t) => !!t)
        .map((t) => ({ id: t.taskKey, name: t.taskName }));

    let taskActive = $derived.by(() =>
        taskChoices
            .filter((choice) => (view.disabledChores[multiTaskKey] || []).indexOf(choice.id) === -1)
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
            (view.disabledChores ||= {})[multiTaskKey] = keys;
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
