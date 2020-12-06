<script lang="ts">
    import Router from 'svelte-spa-router'

    import Settings from './Settings.svelte'
    import Mounts from './collections/Mounts.svelte'
    import Pets from './collections/Pets.svelte'
    import Toys from './collections/Toys.svelte'
    import HomeCards from './home/HomeCards.svelte'
    import HomeTable from './home/HomeTable.svelte'
    import Reputations from './reputations/Reputations.svelte'

    const routes = {
        '/': HomeCards,
        '/cards': HomeCards,
        '/table': HomeTable,
        '/reputations/:slug?': Reputations,

        '/mounts/:slug?': Mounts,
        '/pets/:slug?': Pets,
        '/toys/:slug?': Toys,

        '/settings': Settings,
    }
</script>

<Router {routes} />
