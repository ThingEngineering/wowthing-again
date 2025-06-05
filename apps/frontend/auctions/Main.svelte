<script lang="ts">
    import { onMount } from 'svelte';

    import { auctionsAppState } from '@/auctions/stores/state';
    import { Language } from '@/enums/language';
    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { staticStore } from '@/shared/stores/static';
    import { auctionStore } from '@/stores/auction';

    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    onMount(async () => {
        if (!$auctionsAppState.region) {
            $auctionsAppState.region = Region.US;
        }

        await Promise.all([
            auctionStore.fetch(),
            staticStore.fetch(),
            wowthingData.fetch(Language.enUS),
        ]);
    });

    let error: boolean;
    let loaded: boolean;
    $: {
        error = $auctionStore.error || $staticStore.error;
        loaded = $auctionStore.loaded && $staticStore.loaded;

        if (loaded) {
            staticStore.setup();
        }
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !loaded}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Routes />
{/if}
