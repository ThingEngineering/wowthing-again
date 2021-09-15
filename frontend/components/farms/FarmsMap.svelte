<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import {
        farmStore,
        staticStore,
        timeStore,
        userCollectionStore,
        userQuestStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import getFarmStatus from '@/utils/get-farm-status'
    import type {FarmDataCategory} from '@/types/data'
    import type {FarmStatus} from '@/utils/get-farm-status'

    import Farm from './FarmsFarm.svelte'
    import Map from '@/components/images/Map.svelte'

    export let slug1: string
    export let slug2: string

    // TODO calculate this based on width
    const width = 1200
    const height = 800

    let categories: FarmDataCategory[]
    let farmStatuses: FarmStatus[]
    $: {
        categories = filter(
            find($farmStore.data.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.farms.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        if (categories.length > 0) {
            farmStatuses = getFarmStatus(
                $staticStore.data,
                $userStore.data,
                $userCollectionStore.data,
                $userQuestStore.data,
                $userTransmogStore.data,
                $timeStore,
                categories[0]
            )
        }
    }
</script>

<style lang="scss">
    .farm {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        position: relative;
    }
</style>

{#if categories.length > 0}
    <div class="farm">
        <Map
            name={categories[0].slug}
            width={width}
            height={height}
            alt="Map of {categories[0].name}"
            border={2}
        />

        {#each categories[0].farms as farm, farmIndex}
            <Farm {farm} status={farmStatuses[farmIndex]} />
        {/each}
    </div>
{/if}
