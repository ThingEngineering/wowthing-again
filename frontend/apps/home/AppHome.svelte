<script lang="ts">
    import { onMount } from 'svelte'

    import {
        error as staticError,
        loading as staticLoading,
        fetch as fetchStatic,
    } from '@/stores/static'
    import { userStore } from '@/stores'
    import initializeSets from '@/utils/initialize-sets'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await fetchStatic())
    onMount(async () => await userStore.fetch())

    $: {
        if (!$staticLoading && !$userStore.loading) {
            initializeSets()
        }
    }
</script>

<style lang="scss" global>
    @import 'scss/global.scss';
</style>

<Sidebar />
{#if $staticError || $userStore.error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $staticLoading || $userStore.loading}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
