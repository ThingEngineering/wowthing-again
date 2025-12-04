<script lang="ts">
    import type { StaticDataDecorCategory } from '@/shared/stores/static/types';

    let { category }: { category: StaticDataDecorCategory } = $props();

    import DecorObject from './DecorObject.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
</script>

<div class="collection thing-container">
    <SectionTitle title={category.name} />

    <div class="collection-v2-section">
        {#each category.subCategories as subCategory}
            <div class="collection-v2-group">
                <h4 class="drop-shadow">
                    {subCategory.name}
                </h4>
                <div class="collection-objects">
                    {#each subCategory.objects as decorObject}
                        <DecorObject {decorObject} />
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
