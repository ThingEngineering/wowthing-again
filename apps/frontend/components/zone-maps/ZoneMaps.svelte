<script lang="ts">
    import { afterUpdate } from 'svelte';

    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Map from './ZoneMapsMap.svelte';
    import Sidebar from './ZoneMapsSidebar.svelte';

    export let params: MultiSlugParams;

    afterUpdate(() => {
        getSavedRoute('zone-maps', params.slug1, params.slug2);
    });
</script>

<Sidebar />
<Map slug1={params.slug1} slug2={params.slug2} />
