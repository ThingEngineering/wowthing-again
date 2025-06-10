<script lang="ts">
    import { onMount } from 'svelte';

    import { auctionsAppState } from '@/auctions/stores/state';
    import { Language } from '@/enums/language';
    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { auctionStore } from '@/stores/auction';

    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    let ready = $state(false);

    onMount(async () => {
        if (!$auctionsAppState.region) {
            $auctionsAppState.region = Region.US;
        }

        await Promise.all([
            auctionStore.fetch(),
            wowthingData.fetch(Language.enUS, {
                loadDb: false,
                loadJournal: false,
                loadManual: false,
            }),
        ]);

        ready = true;
    });
</script>

{#if !ready}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Routes />
{/if}
