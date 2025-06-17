<script lang="ts">
    import { achievementStore } from '@/stores';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import ProgressSidebar from './ProgressSidebar.svelte';
    import ProgressTable from './ProgressTable.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => {
        if ($achievementStore.loaded) {
            getSavedRoute('progress', params.slug1, params.slug2);
        }
    });
</script>

<div class="view">
    <ProgressSidebar />
    {#await achievementStore.fetch({ language: settingsState.value.general.language })}
        L O A D I N G ...
    {:then}
        {#if params.slug1 && $achievementStore.loaded}
            <ProgressTable slug1={params.slug1} slug2={params.slug2} />
        {/if}
    {/await}
</div>
