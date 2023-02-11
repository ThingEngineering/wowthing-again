<script lang="ts">
    import find from 'lodash/find'

    import { manualStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import getSkipClasses from '@/utils/get-skip-classes'
    import type { ManualDataTransmogSetCategory } from '@/types/data/manual'

    import Category from './TransmogSetsTableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataTransmogSetCategory[]
    let slugs: string[]
    let skipClasses: Record<string, boolean>
    $: {
        categories = (find($manualStore.transmog.setsV2, (s) => s !== null && s[0].slug === slug1) || [])
            .filter((s) =>
                s.groups.length > 0 &&
                (!slug2 || s.slug === slug2)
            )

        slugs = slug2 ? [slug1, slug2] : [slug1]
        skipClasses = getSkipClasses($settingsStore)
    }
</script>

<div class="thing-container">
    <table class="table table-striped character-table">
        <tbody>
            {#each categories as category, categoryIndex}
                <Category
                    {category}
                    {slugs}
                    {skipClasses}
                    startSpacer={categoryIndex > 0}
                />
            {/each}
        </tbody>
    </table>
</div>
