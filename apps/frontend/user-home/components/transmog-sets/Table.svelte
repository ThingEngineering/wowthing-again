<script lang="ts">
    import find from 'lodash/find'
    import some from 'lodash/some'

    import { manualStore } from '@/stores'
    import { settingsStore } from '@/shared/stores/settings'
    import getSkipClasses from '@/utils/get-skip-classes'
    import type { ManualDataTransmogCategory } from '@/types/data/manual'

    import Category from './TableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataTransmogCategory[]
    let slugs: string[]
    let skipClasses: Record<string, boolean|number>
    $: {
        categories = (find($manualStore.transmog.sets, (s) => s !== null && s[0].slug === slug1) || [])
            .filter((s) =>
                s.groups.length > 0 &&
                !!s.groups[0].type &&
                (!slug2 || s.slug === slug2)
            )

        slugs = slug2 ? [slug1, slug2] : [slug1]

        skipClasses = getSkipClasses($settingsStore, categories?.[0])
        for (let i = 1; i < categories.length; i++) {
            const category = categories[i]
            if (!some(category.groups, (group) => group.type === 'class')) {
                continue
            }

            const catSkipClasses = getSkipClasses($settingsStore, category)
            for (const [key, value] of Object.entries(catSkipClasses)) {
                if (value === false) {
                    skipClasses[key] = false
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
                    {category}
                    {skipClasses}
                    {slugs}
                    startSpacer={categoryIndex > 0}
                />
            {/each}
        </tbody>
    </table>
</div>
