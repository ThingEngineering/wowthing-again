<script lang="ts">
    import debounce from 'lodash/debounce'

    import { multiTaskMap } from '@/data/tasks'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'

    export let multiTaskKey: string
    export let view: SettingsView

    const taskChoices: SettingsChoice[] = multiTaskMap[multiTaskKey]
        .map((t) => ({ id: t.taskKey, name: t.taskName }))

    let taskActive: string[] = taskChoices
        .filter((choice) => (view.disabledChores[multiTaskKey] || []).indexOf(choice.id) === -1)
        .map((choice) => choice.id)

    $: {
        const taskInactive: string[] = taskChoices
            .filter((choice) => taskActive.indexOf(choice.id) === -1)
            .map((choice) => choice.id)

        onTaskChange(taskInactive)
    }

    const onTaskChange = debounce((keys: string[]) => {
        (view.disabledChores ||= {})[multiTaskKey] = keys
    }, 250)
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
    {#each taskChoices as choice}
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
