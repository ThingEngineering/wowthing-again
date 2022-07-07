<script lang="ts">
    import Router from 'svelte-spa-router'

    import Achievements from '@/components/achievements/Achievements.svelte'
    import Appearances from '@/components/appearances/Appearances.svelte'
    import Auctions from '@/components/auctions/Auctions.svelte'
    import Characters from '@/components/characters/Characters.svelte'
    import Currencies from '@/components/currencies/Currencies.svelte'
    import Gear from '@/components/gear/Gear.svelte'
    import History from '@/components/history/History.svelte'
    import HomeCards from '@/components/home/HomeCards.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import Items from '@/components/items/Items.svelte'
    import Journal from '@/components/journal/Journal.svelte'
    import Lockouts from '@/components/lockouts/Lockouts.svelte'
    import Mounts from '@/components/collections/Mounts.svelte'
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte'
    import Pets from '@/components/collections/Pets.svelte'
    import Progress from '@/components/progress/Progress.svelte'
    import Reputations from '@/components/reputations/Reputations.svelte'
    import Settings from '@/components/settings/Settings.svelte'
    import Teams from '@/components/teams/Teams.svelte'
    import Toys from '@/components/collections/Toys.svelte'
    import Vendors from '@/components/vendors/Vendors.svelte'
    import ZoneMaps from '@/components/zone-maps/ZoneMaps.svelte'

    const routes = {
        '/': HomeTable,
        '/cards': HomeCards,
        '/table': HomeTable,

        '/characters/:slug1?/:slug2?/:slug3?/:slug4?': Characters,

        '/achievements/:slug1?/:slug2?': Achievements,
        '/appearances/:slug1?/:slug2?': Appearances,
        '/auctions/:slug1?/:slug2?': Auctions,
        '/currencies/:slug?': Currencies,
        '/gear/*': Gear,
        '/history/:slug?': History,
        '/items/:slug?': Items,
        '/journal/:slug1?/:slug2?': Journal,
        '/lockouts': Lockouts,
        '/mythic-plus/:slug?': MythicPlus,
        '/progress/:slug1?/:slug2?': Progress,
        '/reputations/:slug?': Reputations,
        '/vendors/:slug1?/:slug2?': Vendors,
        '/zone-maps/:slug1?/:slug2?': ZoneMaps,

        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/toys/:slug1?/:slug2?': Toys,

        '/teams/:slug?': Teams,

        '/settings/:slug1?/:slug2?': Settings,
    }
</script>

<Router {routes} />
