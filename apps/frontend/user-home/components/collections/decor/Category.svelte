<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import type { StaticDataDecorCategory } from '@/shared/stores/static/types';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import DecorObject from './DecorObject.svelte';

    let { category }: { category: StaticDataDecorCategory } = $props();
</script>

<style lang="scss">
    .decor-category {
        width: 100%;
    }
</style>

<div class="decor-category">
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={browserState.current.decor.highlightMissing}
                >Highlight missing</CheckboxInput
            >
        </button>

        <span>Show:</span>

        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={browserState.current.decor.showCollected}>Collected</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={browserState.current.decor.showUncollected}>Missing</CheckboxInput
            >
        </button>
    </div>

    <div class="collection thing-container">
        <SectionTitle title={category.name} />

        <div class="collection-section">
            {#each category.subCategories as subCategory (subCategory.id)}
                <div class="collection-group">
                    <h4 class="drop-shadow">
                        {subCategory.name}
                    </h4>
                    <div class="collection-objects">
                        {#each subCategory.objects as decorObject (decorObject.id)}
                            <DecorObject {decorObject} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
