<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import some from 'lodash/some'

    import { manualStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import getSkipClasses from '@/utils/get-skip-classes'
    import type { ManualDataTransmogCategory } from '@/types/data/manual'

    import Category from './SetsTableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataTransmogCategory[]
    let slugs: string[]
    let skipClasses: Record<string, boolean>
    $: {
        categories = filter(
            find($manualStore.data.transmog.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.groups.length > 0 && s.groups[0].type !== null
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        slugs = slug2 ? [slug1, slug2] : [slug1]

        skipClasses = getSkipClasses($settingsData, categories?.[0])
        for (const category of (categories || []).slice(1)) {
            if (!some(category.groups, (group) => group.type === 'class')) {
                continue
            }

            const catSkipClasses = getSkipClasses($settingsData, category)
            for (const [key, value] of Object.entries(catSkipClasses)) {
                if (value === false) {
                    skipClasses[key] = false
                }
            }
        }
    }
</script>

<style lang="scss">
</style>

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
