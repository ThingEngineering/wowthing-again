<script lang="ts">
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';

    import Currencies from './components/currencies/Currencies.svelte';
    import Customizations from './components/customizations/Customizations.svelte';
    import Matrix from './components/matrix/Matrix.svelte';
    import Sets from './components/transmog-sets/TransmogSets.svelte';
    import WorldQuests from './components/world-quests/WorldQuests.svelte';

    import Achievements from '@/components/achievements/Achievements.svelte';
    import Appearances from '@/components/appearances/Appearances.svelte';
    import Collections from '@/user-home/components/collections/Collections.svelte';
    import Everything from './components/everything/Everything.svelte';
    import Heirlooms from '@/components/heirlooms/Heirlooms.svelte';
    import HomeTable from '@/components/home/HomeTable.svelte';
    import Illusions from '@/components/illusions/Illusions.svelte';
    import Journal from '@/components/journal/Journal.svelte';
    import Lockouts from '@/components/lockouts/Lockouts.svelte';
    import Mounts from '@/components/collectible/Mounts.svelte';
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte';
    import Pets from '@/components/collectible/Pets.svelte';
    import Progress from '@/components/progress/Progress.svelte';
    import Reputations from '@/user-home/components/reputations/Reputations.svelte';
    import Toys from '@/components/collectible/Toys.svelte';
    import Vendors from '@/components/vendors/Vendors.svelte';

    const routes = {
        '/': HomeTable,
        '/table': HomeTable,

        // Larger/less used components are dynamically loaded for code-splitting
        '/auctions/:slug1?/:slug2?/:slug3?': wrap({
            asyncComponent: () => import('@/components/auctions/Auctions.svelte'),
        }),
        '/characters/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?/:slug6?': wrap({
            asyncComponent: () => import('@/components/characters/Characters.svelte'),
        }),
        '/explore/:slug1?': wrap({
            asyncComponent: () => import('@/components/explore/Explore.svelte'),
        }),
        '/history/:slug1?': wrap({
            asyncComponent: () => import('@/user-home/components/history/History.svelte'),
        }),
        '/items/:slug1?/:slug2?/:slug3?': wrap({
            asyncComponent: () => import('@/components/items/Items.svelte'),
        }),
        '/professions/:slug1?/:slug2?/:slug3?': wrap({
            asyncComponent: () => import('@/components/professions/Professions.svelte'),
        }),
        '/settings/:slug1?/:slug2?': wrap({
            asyncComponent: () => import('@/user-home/components/settings/Settings.svelte'),
        }),
        '/zone-maps/:slug1?/:slug2?': wrap({
            asyncComponent: () => import('@/components/zone-maps/ZoneMaps.svelte'),
        }),

        '/achievements/:slug1?/:slug2?': Achievements,
        '/currencies/:slug1?/:slug2?': Currencies,
        '/everything/:slug1?': Everything,
        '/heirlooms': Heirlooms,
        '/illusions': Illusions,
        '/journal/:slug1?/:slug2?/:slug3?': Journal,
        '/lockouts': Lockouts,
        '/matrix': Matrix,
        '/mythic-plus/:slug1?': MythicPlus,
        '/progress/:slug1?/:slug2?': Progress,
        '/reputations/:slug1?': Reputations,
        '/sets/:slug1?/:slug2?': Sets,
        '/vendors/:slug1?/:slug2?/:slug3?': Vendors,
        '/world-quests/:slug1?/:slug2?': WorldQuests,

        '/collections/:slug1?/:slug2?/:slug3?/:slug4?': Collections,
        '/appearances/:slug1?/:slug2?': Appearances,
        '/customizations/:slug1?/:slug2?': Customizations,
        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/toys/:slug1?/:slug2?': Toys,
    };
</script>

<Router {routes} />
