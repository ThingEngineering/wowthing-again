<script lang="ts">
    import Router from 'svelte-spa-router'

    import Currencies from '@/components/currencies/Currencies.svelte'
    import Gear from '@/components/gear/Gear.svelte'
    import HomeCards from '@/components/home/Cards.svelte'
    import HomeTable from '@/components/home/Table.svelte'
    import Lockouts from '@/components/lockouts/Lockouts.svelte'
    import Mounts from '@/components/collections/Mounts.svelte'
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte'
    import Pets from '@/components/collections/Pets.svelte'
    import Reputations from '@/components/reputations/Reputations.svelte'
    import Settings from '@/components/settings/Settings.svelte'
    import Toys from '@/components/collections/Toys.svelte'
    import Transmog from '@/components/transmog/Transmog.svelte'

    const routes = {
        '/': HomeTable,
        '/cards': HomeCards,
        '/table': HomeTable,

        '/currencies/:slug?': Currencies,
        '/gear': Gear,
        '/lockouts': Lockouts,
        '/mythicplus/:slug?': MythicPlus,
        '/reputations/:slug?': Reputations,
        '/transmog/:slug?': Transmog,

        '/mounts/:slug?': Mounts,
        '/pets/:slug?': Pets,
        '/toys/:slug?': Toys,

        '/settings/*': Settings,
    }
</script>

<Router {routes} />
