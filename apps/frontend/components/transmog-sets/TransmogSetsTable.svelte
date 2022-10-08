<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { manualStore } from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import getSkipClasses from '@/utils/get-skip-classes'
    import type { ManualDataTransmogSetCategory } from '@/types/data/manual'

    import Category from './TransmogSetsTableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataTransmogSetCategory[]
    let slugs: string[]
    let skipClasses: Record<string, boolean>
    $: {
        categories = filter(
            find($manualStore.data.transmog.setsV2, (s) => s !== null && s[0].slug === slug1),
            (s) => s.groups.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        slugs = slug2 ? [slug1, slug2] : [slug1]
        skipClasses = getSkipClasses($settingsData)
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
                    {slugs}
                    {skipClasses}
                    startSpacer={categoryIndex > 0}
                />
            {/each}
        </tbody>
    </table>
</div>
