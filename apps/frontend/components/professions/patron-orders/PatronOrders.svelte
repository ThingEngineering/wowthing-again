<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './Sidebar.svelte';

    export let slug: string

    afterUpdate(() => getSavedRoute('professions/patron-orders', slug))
</script>

<Sidebar />
