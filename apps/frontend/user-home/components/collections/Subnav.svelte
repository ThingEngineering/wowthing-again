<script lang="ts">
    import active from 'svelte-spa-router/active';

    import { lazyState } from '@/user-home/state/lazy';
    import { userState } from '@/user-home/state/user';

    import Percent from '@/components/common/Percent.svelte';
</script>

<style lang="scss">
    .subnav-wrapper {
        background: var(--color-body-background);
        padding-bottom: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .subnav {
        --image-margin-top: -0.2rem;

        font-size: 1.1rem;
    }
</style>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="collections-subnav">
        <a href="#/collections/appearances" use:active={'/collections/appearances/*'}>
            Appearances
            <Percent percent={lazyState.appearances.stats.OVERALL.percent} />
        </a>

        <a href="#/collections/artifacts" use:active>
            Artifacts
            <!-- <Percent percent={lazyState.customizations.OVERALL.percent} /> -->
        </a>

        <a href="#/collections/customizations" use:active={'/collections/customizations/*'}>
            Customizations
            <Percent percent={lazyState.customizations.OVERALL.percent} />
        </a>

        <a href="#/collections/heirlooms" use:active>
            Heirlooms
            <Percent percent={userState.heirloomStats.AVAILABLE.percent} />
        </a>

        <a href="#/collections/illusions" use:active>
            Illusions
            <Percent percent={userState.illusionStats.AVAILABLE.percent} />
        </a>

        <a href="#/collections/recipes" use:active={'/collections/recipes/*'}>
            Recipes
            <Percent percent={userState.recipes.stats.OVERALL.percent} />
        </a>

        <a href="#/collections/mounts" use:active={'/collections/mounts/*'}>
            Mounts
            <Percent percent={userState.mounts.stats.OVERALL.percent} />
        </a>

        <a href="#/collections/pets" use:active={'/collections/pets/*'}>
            Pets
            <Percent percent={userState.pets.stats.OVERALL.percent} />
        </a>

        <a href="#/collections/toys" use:active={'/collections/toys/*'}>
            Toys
            <Percent percent={userState.toys.stats.OVERALL.percent} />
        </a>
    </nav>
</div>
