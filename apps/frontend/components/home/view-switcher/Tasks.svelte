<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Task from './Task.svelte';
</script>

{#if settingsState.value.layout.homeTasksV2?.length > 0}
    <div class="flex-wrapper">
        {#each settingsState.value.layout.homeTasksV2 as taskKey (taskKey)}
            <Task {taskKey} />
        {/each}
    </div>
{/if}
