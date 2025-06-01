<script lang="ts">
    import find from 'lodash/find';

    import { wowthingData } from '@/shared/stores/data';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getSkipClasses from '@/utils/get-skip-classes';
    import type { ManualDataTransmogCategory } from '@/types/data/manual';

    import Category from './TableCategory.svelte';

    export let slug1: string;
    export let slug2: string;

    let anyClasses: boolean;
    let categories: ManualDataTransmogCategory[];
    let slugs: string[];
    let skipClasses: Record<string, boolean | number>;
    $: {
        categories = (
            find(wowthingData.manual.transmog.sets, (s) => s !== null && s[0].slug === slug1) || []
        ).filter((s) => s.groups.length > 0 && !!s.groups[0].type && (!slug2 || s.slug === slug2));

        slugs = slug2 ? [slug1, slug2] : [slug1];

        anyClasses = false;
        skipClasses = getSkipClasses(settingsState.value, categories?.[0]);
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (!category.groups.some((group) => group.type === 'class')) {
                continue;
            }

            anyClasses = true;

            const catSkipClasses = getSkipClasses(settingsState.value, category);
            for (const [key, value] of Object.entries(catSkipClasses)) {
                if (value === false) {
                    skipClasses[key] = false;
                }
            }
        }
    }
</script>

<div class="thing-container">
    <table class="table table-striped character-table">
        <tbody>
            {#each categories as category, categoryIndex}
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
