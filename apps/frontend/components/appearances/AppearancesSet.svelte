<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer'

    import { appearanceStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import type { UserCount } from '@/types'
    import type { AppearanceDataSet } from '@/types/data/appearance'

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte'
    import Item from './AppearancesItem.svelte'

    export let set: AppearanceDataSet
    export let slug: string

    let element: HTMLElement
    let intersected: boolean
    let percent: number
    let stats: UserCount
    $: {
        stats = $appearanceStore.stats[slug]
        percent = (stats?.have || 0) / (stats?.total || 1) * 100
    }
</script>

<div class="collection-v2-group">
    <h4 class="drop-shadow {getPercentClass(percent)}">
        {set.name}
        <CollectibleCount counts={stats} />
    </h4>
    
    <div
        bind:this={element}
        class="collection-objects"
    >
        <IntersectionObserver
            bind:intersecting={intersected}
            once
            {element}
        >
            {#if intersected}
                {#each set.appearances as appearance}
                    <Item {appearance} />
                {/each}
            {/if}
        </IntersectionObserver>
    </div>
</div>
