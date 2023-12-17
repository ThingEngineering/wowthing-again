<script lang="ts">
    import { afterUpdate } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import { userStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Routes from './Routes.svelte'
    import Sidebar from './Sidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('settings', params.slug1, params.slug2))

    $: if ($userStore.public) { replace('/') }
</script>

{#if !$userStore.public}
    <Sidebar />
    <Routes {params} />
{/if}
