<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore, userStore } from '@/stores'
    import initializeSets from '@/utils/initialize-sets'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await staticStore.fetch())
    onMount(async () => await userStore.fetch())

    $: {
        if ($staticStore.loaded && $userStore.loaded) {
            initializeSets()
        }
    }
</script>

<style lang="scss" global>
    @import 'scss/global.scss';
</style>

<Sidebar />
{#if $staticStore.error || $userStore.error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !$staticStore.loaded || !$userStore.loaded}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
