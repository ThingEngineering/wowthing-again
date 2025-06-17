<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Instance from './JournalInstance.svelte';
    import Sidebar from './JournalSidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('journal', params.slug1, params.slug2, params.slug3));
</script>

<Sidebar />
<Instance slug1={params.slug1} slug2={params.slug2} slug3={params.slug3} />
