<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import {FarmDataCategory} from '@/types/data'
    import {farmStore} from '@/stores'

    import Farms from './FarmsFarms.svelte'
    import Map from '@/components/images/Map.svelte'

    export let slug1: string
    export let slug2: string

    // TODO calculate this based on width
    const width = 1200
    const height = 800

    let categories: FarmDataCategory[]
    $: {
        console.log(slug1, slug2)
        categories = filter(
            find($farmStore.data.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.farms.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        console.log(categories)
    }
</script>

<style lang="scss">
    div {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        position: relative;
    }
</style>

{#each categories as category}
    <div>
        <Map
            name={category.slug}
            width={width}
            height={height}
            alt="Map of {category.name}"
            border={2}
        />
        <Farms farms={category.farms} />
    </div>
{/each}
