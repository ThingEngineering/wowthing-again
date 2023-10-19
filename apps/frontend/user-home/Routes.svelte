<script lang="ts">
    import Router from 'svelte-spa-router'
    import { wrap } from 'svelte-spa-router/wrap'

    import Achievements from '@/components/achievements/Achievements.svelte'
    import Appearances from '@/components/appearances/Appearances.svelte'
    import Auctions from '@/components/auctions/Auctions.svelte'
    import Collections from '@/components/collections/Collections.svelte'
    import Currencies from '@/user-home/components/currencies/Currencies.svelte'
    import Explore from '@/components/explore/Explore.svelte'
    import Heirlooms from '@/components/heirlooms/Heirlooms.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import Illusions from  '@/components/illusions/Illusions.svelte'
    import Items from '@/components/items/Items.svelte'
    import Journal from '@/components/journal/Journal.svelte'
    import Lockouts from '@/components/lockouts/Lockouts.svelte'
    import Matrix from '@/user-home/components/matrix/Matrix.svelte'
    import Mounts from '@/components/collectible/Mounts.svelte'
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte'
    import Pets from '@/components/collectible/Pets.svelte'
    import Professions from '@/components/professions/Professions.svelte'
    import Progress from '@/components/progress/Progress.svelte'
    import Reputations from '@/components/reputations/Reputations.svelte'
    import Sets from '@/components/sets/Sets.svelte'
    import Toys from '@/components/collectible/Toys.svelte'
    import Vendors from '@/components/vendors/Vendors.svelte'
    import WorldQuests from '@/user-home/components/world-quests/WorldQuests.svelte'
    import ZoneMaps from '@/components/zone-maps/ZoneMaps.svelte'

    const routes = {
        '/': HomeTable,
        '/table': HomeTable,

        // Expensive components are dynamically loaded for code-splitting
        '/characters/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?/:slug6?': wrap({
            asyncComponent: () => import('@/components/characters/Characters.svelte')
        }),
        '/history/:slug?': wrap({
            asyncComponent: () => import('@/components/history/History.svelte')
        }),
        '/settings/:slug1?/:slug2?': wrap({
            asyncComponent: () => import('@/components/settings/Settings.svelte')
        }),

        '/achievements/:slug1?/:slug2?': Achievements,
        '/appearances/:slug1?/:slug2?': Appearances,
        '/auctions/:slug1?/:slug2?': Auctions,
        '/collections/:slug1?/:slug2?/:slug3?/:slug4?': Collections,
        '/currencies/:slug1?/:slug2?': Currencies,
        '/heirlooms': Heirlooms,
        '/illusions': Illusions,
        '/items/:slug1?/:slug2?/:slug3?': Items,
        '/journal/:slug1?/:slug2?/:slug3?': Journal,
        '/lockouts': Lockouts,
        '/matrix': Matrix,
        '/mythic-plus/:slug?': MythicPlus,
        '/professions/:slug1?/:slug2?/:slug3?': Professions,
        '/progress/:slug1?/:slug2?': Progress,
        '/reputations/:slug?': Reputations,
        '/sets/:slug1?/:slug2?': Sets,
        '/vendors/:slug1?/:slug2?': Vendors,
        '/world-quests/:slug1?/:slug2?': WorldQuests,
        '/zone-maps/:slug1?/:slug2?': ZoneMaps,

        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/toys/:slug1?/:slug2?': Toys,

        '/explore/:slug1?': Explore,
    }
</script>

<Router {routes} />
