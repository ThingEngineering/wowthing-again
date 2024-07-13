<script lang="ts">
    import { recipesState } from './state'
    import { lazyStore } from '@/stores';
    import type { StaticDataProfessionCategory } from '@/shared/stores/static/types';
    import type { MultiSlugParams } from '@/types';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    export let category: StaticDataProfessionCategory
    export let params: MultiSlugParams
</script>

<style lang="scss">
    .progress-bar {
        --bar-height: 1.7rem;

        margin-left: 1rem;
        width: 15rem;
    }
</style>

<div class="options-container">
    <button>
        <Checkbox
            name="highlight_missing"
            bind:value={$recipesState.highlightMissing}
        >Highlight missing</Checkbox>
    </button>

    <span>Show:</span>

    <button>
        <Checkbox
            name="show_collected"
            bind:value={$recipesState.showCollected}
        >Collected</Checkbox>
    </button>

    <button>
        <Checkbox
            name="show_uncollected"
            bind:value={$recipesState.showUncollected}
        >Missing</Checkbox>
    </button>

    {#if category}
        {@const stats = $lazyStore.recipes.stats[`${params.slug1}--${params.slug2}`]}
        <div class="progress-bar">
            <ProgressBar
                title="Recipes"
                have={stats.have}
                total={stats.total}
            />
        </div>
    {/if}
</div>
