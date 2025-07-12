<script lang="ts">
    import { searchStore } from './store';
    import { auctionsAppState } from '@/auctions/stores/state';
    import { Region } from '@/enums/region';
    import type { ParamsSlugsProps } from '@/types/props';

    import Results from '@/auctions/components/results/Results.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    let { params }: ParamsSlugsProps = $props();

    let searchString = $derived(params.slug2);
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
    .header {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="wrapper-column">
    <UnderConstruction />

    {#if searchString}
        <div class="header">
            <span>
                <code>[{Region[$auctionsAppState.region]}]</code>
                Search
            </span>
            <span>&gt;</span>
            <span>"{params.slug2}"</span>
        </div>

        <Results
            loadFunc={async () => await searchStore.search($auctionsAppState, searchString)}
            selected={params.slug3}
            url={`#/search/${params.slug1}/${searchString}`}
        />
    {/if}
</div>
