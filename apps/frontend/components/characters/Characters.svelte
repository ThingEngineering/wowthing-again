<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Sidebar from './CharactersSidebar.svelte';
    import View from './CharactersView.svelte';

    let { params }: { params: MultiSlugParams } = $props();

    $effect(() => getSavedRoute('characters', params.slug1, params.slug2));
</script>

<Sidebar />
<View {params} />
