<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import type { MultiSlugParams } from '@/types'

    import ExtraPets from './AuctionsExtraPets.svelte'
    import Missing from './AuctionsMissing.svelte'

    export let params: MultiSlugParams

    const componentMap: Record<string, typeof SvelteComponent> = {
        'extra-pets': ExtraPets,
        'missing-mounts': Missing,
        'missing-pets': Missing,
        'missing-toys': Missing,
    }

</script>

<svelte:component
    this={componentMap[params.slug1]}
    slug={params.slug1}
/>
