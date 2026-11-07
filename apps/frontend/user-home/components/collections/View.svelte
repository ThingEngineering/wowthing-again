<script lang="ts">
    import { setBasePathContext } from '@/shared/contexts/basePath';

    import Routes from './Routes.svelte';

    setBasePathContext(() => 'collections');
</script>

<div>
    <Routes />
    <!-- {#if params.slug1 === 'appearances'}
        <Appearances basePath="collections" params={shiftedParams} />
    {:else if params.slug1 === 'artifacts'}
        <Artifacts />
    {:else if params.slug1 === 'customizations'}
        <Customizations basePath="collections" params={shiftedParams} />
    {:else if params.slug1 === 'decor'}
        <Decor params={shiftedParams} />
    {:else if params.slug1 === 'heirlooms'}
        <Heirlooms />
    {:else if params.slug1 === 'illusions'}
        <Illusions />
    {:else if params.slug1 === 'mage-tower'}
        <MageTower />
    {:else if params.slug1 === 'mounts'}
        <Mounts basePath="collections" params={shiftedParams} />
    {:else if params.slug1 === 'pets'}
        <Pets basePath="collections" params={shiftedParams} />
    {:else if params.slug1 === 'recipes'}
        <Recipes params={shiftedParams} />
    {:else if params.slug1 === 'toys'}
        <Toys basePath="collections" params={shiftedParams} />
    {/if} -->
</div>
