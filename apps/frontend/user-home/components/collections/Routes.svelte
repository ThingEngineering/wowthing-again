<script lang="ts">
    import Router, { router } from 'svelte-spa-router';

    import Appearances from '@/components/appearances/Appearances.svelte';
    import Artifacts from './artifacts/Artifacts.svelte';
    import Customizations from '@/user-home/components/customizations/Customizations.svelte';
    import Decor from './decor/Decor.svelte';
    import Heirlooms from '@/components/heirlooms/Heirlooms.svelte';
    import Illusions from '@/components/illusions/Illusions.svelte';
    import MageTower from './mage-tower/MageTower.svelte';
    import Mounts from '@/components/collectible/Mounts.svelte';
    import Pets from '@/components/collectible/pets/Pets.svelte';
    import Recipes from './recipes/Recipes.svelte';
    import Toys from '@/components/collectible/Toys.svelte';

    const routes = {
        '/appearances/:slug1?/:slug2?': Appearances,
        '/artifacts': Artifacts,
        '/customizations/:slug1?/:slug2?': Customizations,
        '/decor/:slug1?': Decor,
        '/heirlooms': Heirlooms,
        '/illusions': Illusions,
        '/mage-tower': MageTower,
        '/mounts/:slug1?/:slug2?': Mounts,
        '/pets/:slug1?/:slug2?': Pets,
        '/recipes/:slug1?/:slug2?': Recipes,
        '/toys/:slug1?/:slug2?': Toys,
        // meow
    };
</script>

<Router prefix="/collections" {routes} />
