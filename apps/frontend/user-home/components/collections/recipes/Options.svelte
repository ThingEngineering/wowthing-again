<script lang="ts">
    import { recipesState } from './state';
    import { userState } from '@/user-home/state/user';
    import type { StaticDataProfessionCategory } from '@/shared/stores/static/types';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    type Props = {
        category: StaticDataProfessionCategory;
        expansionSlug: string;
        professionSlug: string;
    };
    let { category, expansionSlug, professionSlug }: Props = $props();
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
        <Checkbox name="highlight_missing" bind:value={$recipesState.highlightMissing}
            >Highlight missing</Checkbox
        >
    </button>

    <span>Show:</span>

    <button>
        <Checkbox name="show_collected" bind:value={$recipesState.showCollected}>Collected</Checkbox
        >
    </button>

    <button>
        <Checkbox name="show_uncollected" bind:value={$recipesState.showUncollected}
            >Missing</Checkbox
        >
    </button>

    {#if category}
        {@const stats = userState.recipes.stats[`${professionSlug}--${expansionSlug}`]}
        <div class="progress-bar">
            <ProgressBar title="Recipes" have={stats.have} total={stats.total} />
        </div>
    {/if}
</div>
