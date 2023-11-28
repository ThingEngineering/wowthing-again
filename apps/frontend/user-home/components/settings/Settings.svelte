<script lang="ts">
    import { afterUpdate } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import { userStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('settings', params.slug1, params.slug2))

    $: if ($userStore.public) { replace('/') }
</script>

{#if !$userStore.public}
    <Sidebar />
    <View
        slug1={params.slug1}
        slug2={params.slug2}
    />
{/if}
