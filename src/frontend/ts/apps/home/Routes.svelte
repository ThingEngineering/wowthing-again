<script lang="ts">
    import Router from 'svelte-spa-router'

    import Gear from '../../components/gear/Gear.svelte'
    import CharactersCards from '../../components/characters/CharactersCards.svelte'
    import CharactersTable from '../../components/characters/CharactersTable.svelte'
    import Mounts from '../../components/collections/Mounts.svelte'
    import MythicPlus from '../../components/mythicplus/MythicPlus.svelte'
    import Pets from '../../components/collections/Pets.svelte'
    import Reputations from '../../components/reputations/Reputations.svelte'
    import Settings from '../../components/settings/Settings.svelte'
    import Toys from '../../components/collections/Toys.svelte'

    const routes = {
        '/': CharactersCards,
        '/cards': CharactersCards,
        '/table': CharactersTable,

        '/gear': Gear,
        '/mythicplus/:slug?': MythicPlus,
        '/reputations/:slug?': Reputations,

        '/mounts/:slug?': Mounts,
        '/pets/:slug?': Pets,
        '/toys/:slug?': Toys,

        '/settings/*': Settings,
    }
</script>

<Router {routes} />
