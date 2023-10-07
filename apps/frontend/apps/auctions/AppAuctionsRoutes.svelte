<script lang="ts">
    import Router from 'svelte-spa-router'

    import Browse from './browse/AppAuctionsBrowse.svelte'
    import Search from './search/AppAuctionsSearch.svelte'

    const routes = {
        '/browse/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?': Browse,
        '/search/:slug1?/:slug2?/:slug3?': Search,
    }
</script>

<Router {routes} />
