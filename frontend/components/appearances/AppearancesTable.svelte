<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'

    import {transmogStore} from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import type {Dictionary} from '@/types'
    import type {TransmogDataCategory} from '@/types/data'
    import getSkipClasses from '@/utils/get-skip-classes'

    import Category from './AppearancesTableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: TransmogDataCategory[]
    let setKey: string
    let skipClasses: Dictionary<boolean>
    $: {
        categories = filter(
            find($transmogStore.data.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.groups.length > 0 && s.groups[0].type !== null
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        setKey = slug2 ? `${slug1}--${slug2}` : slug1
        skipClasses = getSkipClasses($settingsData, categories?.[0])
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
                    {setKey}
                    {skipClasses}
                    startSpacer={categoryIndex > 0}
                />
            {/each}
        </tbody>
    </table>
</div>
