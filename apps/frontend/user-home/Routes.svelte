<script lang="ts">
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';
    import type { SvelteComponent } from 'svelte';

    import Currencies from './components/currencies/Currencies.svelte';
    import Customizations from './components/customizations/Customizations.svelte';
    import Matrix from './components/matrix/Matrix.svelte';
    import Sets from './components/transmog-sets/TransmogSets.svelte';
    import WorldQuests from './components/world-quests/WorldQuests.svelte';

    import Achievements from '@/components/achievements/Achievements.svelte';
    import Appearances from '@/components/appearances/Appearances.svelte';
    import Auctions from '@/components/auctions/Auctions.svelte';
    import Characters from '@/components/characters/Characters.svelte';
    import Collections from '@/user-home/components/collections/Collections.svelte';
    import Explore from '@/components/explore/Explore.svelte';
    import Heirlooms from '@/components/heirlooms/Heirlooms.svelte';
    import History from '@/user-home/components/history/History.svelte';
    import HomeTable from '@/components/home/HomeTable.svelte';
    import Illusions from '@/components/illusions/Illusions.svelte';
    import Items from '@/components/items/Items.svelte';
    import Journal from '@/components/journal/Journal.svelte';
    import Lockouts from '@/components/lockouts/Lockouts.svelte';
    import Mounts from '@/components/collectible/Mounts.svelte';
    import MythicPlus from '@/components/mythic-plus/MythicPlus.svelte';
    import Pets from '@/components/collectible/Pets.svelte';
    import Professions from '@/components/professions/Professions.svelte';
    import Progress from '@/components/progress/Progress.svelte';
    import Reputations from '@/user-home/components/reputations/Reputations.svelte';
    import Settings from '@/user-home/components/settings/Settings.svelte';
    import Toys from '@/components/collectible/Toys.svelte';
    import Vendors from '@/components/vendors/Vendors.svelte';
    import ZoneMaps from '@/components/zone-maps/ZoneMaps.svelte';

    const routes = {
        '/': HomeTable,
        '/table': HomeTable,

        // Expensive components are dynamically loaded for code-splitting
        '/characters/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?/:slug6?': Characters,
        // : wrap({
        //     asyncComponent: () =>
        //         import('@/components/characters/Characters.svelte') as Promise<{
        //             default: typeof SvelteComponent;
        //         }>,
        // }),
        '/history/:slug?': History,
        // : wrap({
        //     asyncComponent: () =>
        //         import('./components/history/History.svelte') as Promise<{
        //             default: typeof SvelteComponent;
        //         }>,
        // }),
        '/settings/:slug1?/:slug2?': Settings,
        //: wrap({
        //     asyncComponent: () =>
        //         import('./components/settings/Settings.svelte') as Promise<{
        //             default: typeof SvelteComponent;
        //         }>,
        // }),

        '/achievements/:slug1?/:slug2?': Achievements,
        '/auctions/:slug1?/:slug2?': Auctions,
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
        '/vendors/:slug1?/:slug2?/:slug3?': Vendors,
        '/world-quests/:slug1?/:slug2?': WorldQuests,
        '/zone-maps/:slug1?/:slug2?': ZoneMaps,

        '/collections/:slug1?/:slug2?/:slug3?/:slug4?': Collections,
        '/appearances/:slug1?/:slug2?': Appearances,
        '/customizations/:slug1?/:slug2?': Customizations,
        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/toys/:slug1?/:slug2?': Toys,

        '/explore/:slug1?': Explore,
    };
</script>

<Router {routes} />
