<script lang="ts">
    import find from 'lodash/find';

    import { wowthingData } from '@/shared/stores/data';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getSkipClasses from '@/utils/get-skip-classes';
    import type { ManualDataTransmogCategory } from '@/types/data/manual';

    import Category from './TableCategory.svelte';

    let { slug1, slug2 }: { slug1: string; slug2: string } = $props();

    let slugs = $derived(slug2 ? [slug1, slug2] : [slug1]);
    let categories: ManualDataTransmogCategory[] = $derived.by(() =>
        (
            find(wowthingData.manual.transmog.sets, (s) => s !== null && s[0].slug === slug1) || []
        ).filter((s) => s.groups.length > 0 && !!s.groups[0].type && (!slug2 || s.slug === slug2))
    );

    let [anyClasses, skipClasses] = $derived.by(() => {
        let retAnyClasses = false;
        let retSkipClasses = getSkipClasses(settingsState.value, categories?.[0]);
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (!category.groups.some((group) => group.type === 'class')) {
                continue;
            }

            retAnyClasses = true;

            const catSkipClasses = getSkipClasses(settingsState.value, category);
            for (const [key, value] of Object.entries(catSkipClasses)) {
                if (value === false) {
                    retSkipClasses[key] = false;
                }
            }
        }

        return [retAnyClasses, retSkipClasses];
    });
</script>

<div class="thing-container">
    <table class="table table-striped character-table">
        <tbody>
            {#each categories as category, categoryIndex (category)}
                <Category
                    {anyClasses}
                    {category}
                    {skipClasses}
                    {slugs}
                    startSpacer={categoryIndex > 0}
                />
            {/each}
        </tbody>
    </table>
</div>
