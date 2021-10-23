<script lang="ts">
    import Router from 'svelte-spa-router'

    import Achievements from '@/components/achievements/Achievements.svelte'
    import Currencies from '@/components/currencies/Currencies.svelte'
    import Gear from '@/components/gear/Gear.svelte'
    import HomeCards from '@/components/home/HomeCards.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import Lockouts from '@/components/lockouts/Lockouts.svelte'
    import Mounts from '@/components/collections/Mounts.svelte'
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte'
    import Pets from '@/components/collections/Pets.svelte'
    import Progress from '@/components/progress/Progress.svelte'
    import Reputations from '@/components/reputations/Reputations.svelte'
    import Settings from '@/components/settings/Settings.svelte'
    import Teams from '@/components/teams/Teams.svelte'
    import Toys from '@/components/collections/Toys.svelte'
    import Transmog from '@/components/transmog/Transmog.svelte'
    import ZoneMaps from '@/components/zone-maps/ZoneMaps.svelte'

    const routes = {
        '/': HomeTable,
        '/cards': HomeCards,
        '/table': HomeTable,

        '/achievements/:slug1?/:slug2?': Achievements,
        '/currencies/:slug?': Currencies,
        '/gear/*': Gear,
        '/lockouts': Lockouts,
        '/mythic-plus/:slug?': MythicPlus,
        '/progress/:slug?': Progress,
        '/reputations/:slug?': Reputations,
        '/transmog/:slug1?/:slug2?': Transmog,
        '/zone-maps/:slug1?/:slug2?': ZoneMaps,

        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/toys/:slug1?/:slug2?': Toys,

        '/teams/:slug?': Teams,

        '/settings/:slug?': Settings,
    }
</script>

<Router {routes} />
