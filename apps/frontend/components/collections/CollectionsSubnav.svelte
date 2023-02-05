<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { lazyStore } from '@/stores'

    import Percent from '@/components/common/Percent.svelte'
</script>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="collections-subnav">
        <a href={"#/collections/appearances"} use:active={"/collections/appearances/*"}>
            Appearances
            <Percent percent={$lazyStore.appearances.OVERALL.percent} />
        </a>
        <a href={"#/collections/heirlooms"} use:active>
            Heirlooms
            <Percent percent={$lazyStore.heirlooms.AVAILABLE.percent} />
        </a>
        <a href={"#/collections/illusions"} use:active>
            Illusions
            <Percent percent={$lazyStore.illusions.AVAILABLE.percent} />
        </a>
        <a href={"#/collections/mounts"} use:active={"/collections/mounts/*"}>
            Mounts
            <Percent percent={$lazyStore.mounts.OVERALL.percent} />
        </a>
        <a href={"#/collections/pets"} use:active={"/collections/pets/*"}>
            Pets
            <Percent percent={$lazyStore.pets.OVERALL.percent} />
        </a>
        <a href={"#/collections/toys"} use:active={"/collections/toys/*"}>
            Toys
            <Percent percent={$lazyStore.toys.OVERALL.percent} />
        </a>
    </nav>
</div>

<style lang="scss">
    .subnav-wrapper {
        background: $body-background;
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
