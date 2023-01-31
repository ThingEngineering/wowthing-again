<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { userStatsStore } from '@/stores'

    import Percent from '@/components/common/Percent.svelte'
</script>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="collections-subnav">
        <a href={"#/collections/heirlooms"} use:active>
            Heirlooms
            <Percent percent={$userStatsStore.heirlooms.AVAILABLE.percent} />
        </a>
        <a href={"#/collections/illusions"} use:active>
            Illusions
            <Percent percent={$userStatsStore.illusions.AVAILABLE.percent} />
        </a>
        <a href={"#/collections/mounts"} use:active={"/collections/mounts/*"}>
            Mounts
            <Percent percent={$userStatsStore.mounts.OVERALL.percent} />
        </a>
        <a href={"#/collections/pets"} use:active={"/collections/pets/*"}>
            Pets
            <Percent percent={$userStatsStore.pets.OVERALL.percent} />
        </a>
        <a href={"#/collections/toys"} use:active={"/collections/toys/*"}>
            Toys
            <Percent percent={$userStatsStore.toys.OVERALL.percent} />
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
