<script lang="ts">
    import {onMount} from 'svelte'

    import {error as staticError, loading as staticLoading, fetch as fetchStatic} from './stores/static-store'
    import {error as userError, loading as userLoading, fetch as fetchUser} from './stores/user-store'
    import initializeSets from './utils/initialize-sets'

    import Routes from './components/Routes.svelte'
    import Sidebar from './components/Sidebar.svelte'

    onMount(() => fetchStatic())
    onMount(() => fetchUser())

    $: {
        if (!$staticLoading && !$userLoading) {
            initializeSets()
        }
    }
</script>

<style lang="scss" global>
    @import "../scss/global.scss";
</style>

<Sidebar />
{#if $staticError || $userError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $staticLoading || $userLoading}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
