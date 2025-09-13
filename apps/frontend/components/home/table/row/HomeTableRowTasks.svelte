<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { activeViewTasks } from '@/user-home/state/activeViewTasks.svelte';
    import type { CharacterProps } from '@/types/props';

    import RowChore from './HomeTableRowTaskChore.svelte';
    import RowTask from './HomeTableRowTask.svelte';

    let { character }: CharacterProps = $props();
</script>

{#key settingsState.activeView.id}
    {#each activeViewTasks.value as fullTaskName (fullTaskName)}
        {@const [taskName, choreName] = fullTaskName.split('|', 2)}
        {#if choreName}
            <RowChore {character} {fullTaskName} {taskName} {choreName} />
        {:else}
            <RowTask {character} {fullTaskName} {taskName} />
        {/if}
    {/each}
{/key}
