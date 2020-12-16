<script lang="ts">
    import Router from 'svelte-spa-router'

    import Gear from './gear/Gear.svelte'
    import HomeCards from './home/cards/Index.svelte'
    import HomeTable from './home/HomeTable.svelte'
    import Mounts from './collections/Mounts.svelte'
    import Pets from './collections/Pets.svelte'
    import Reputations from './reputations/Reputations.svelte'
    import Settings from './settings/Settings.svelte'
    import Toys from './collections/Toys.svelte'

    const routes = {
        '/': HomeCards,
        '/cards': HomeCards,
        '/table': HomeTable,

        '/gear': Gear,
        '/reputations/:slug?': Reputations,

        '/mounts/:slug?': Mounts,
        '/pets/:slug?': Pets,
        '/toys/:slug?': Toys,

        '/settings/*': Settings,
    }
</script>

<Router {routes} />
