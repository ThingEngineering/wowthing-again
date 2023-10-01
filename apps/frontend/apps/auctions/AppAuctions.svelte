<script lang="ts">
    import { onMount } from 'svelte'

    import { auctionStore } from '@/stores/auction'

    onMount(async () => await Promise.all([
        auctionStore.fetch(),
    ]))

    console.log('moo')

    let error: boolean
    let loaded: boolean
    $: {
        error = $auctionStore.error
        loaded = $auctionStore.loaded
    }
</script>
