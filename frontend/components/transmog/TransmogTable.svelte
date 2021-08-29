<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import sumBy from 'lodash/sumBy'

    import {transmogStore} from '@/stores'
    import type {Dictionary} from '@/types'
    import type {TransmogDataCategory} from '@/types/data'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import TransmogTableCategory from './TransmogTableCategory.svelte'

    export let slug1: string
    export let slug2: string

    let categories: TransmogDataCategory[]
    let setKey: string
    let skipClasses: Dictionary<boolean>
    let clothSpan: number
    let leatherSpan: number
    let mailSpan: number
    let plateSpan: number
    $: {
        categories = filter(
            find($transmogStore.data.sets, (s) => s[0].slug === slug1),
            (s) => s.groups.length > 0 && s.groups[0].type !== null
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        setKey = slug2 ? `${slug1}--${slug2}` : slug1

        skipClasses = {}
        if (categories.length > 0) {
            for (const skipClass of categories[0].skipClasses) {
                skipClasses[skipClass] = true
            }

            clothSpan = sumBy([
                !skipClasses['mage'],
                !skipClasses['priest'],
                !skipClasses['warlock'],
            ], (s) => Number(s))
            leatherSpan = sumBy([
                !skipClasses['demon-hunter'],
                !skipClasses['druid'],
                !skipClasses['monk'],
                !skipClasses['rogue'],
            ], (s) => Number(s))
            mailSpan = sumBy([
                !skipClasses['hunter'],
                !skipClasses['shaman'],
            ], (s) => Number(s))
            plateSpan = sumBy([
                !skipClasses['death-knight'],
                !skipClasses['paladin'],
                !skipClasses['warrior'],
            ], (s) => Number(s))
        }

        clothSpan = clothSpan || 3
        leatherSpan = leatherSpan || 4
        mailSpan = mailSpan || 2
        plateSpan = plateSpan || 3
    }
</script>

<style lang="scss">
    table {
        --icon-border-width: 1px;
    }
    .icon {
        @include cell-width($width-transmog, $paddingLeft: 0.1rem, $paddingRight: 0.1rem);

        padding-top: 0.1rem;
        padding-bottom:0.1rem;
    }
</style>

<div class="thing-container">
    <table class="table table-striped character-table">
        <thead>
            <tr>
                <th></th>
                <th colspan="{clothSpan}">Cloth</th>
                <th colspan="{leatherSpan}">Leather</th>
                <th colspan="{mailSpan}">Mail</th>
                <th colspan="{plateSpan}">Plate</th>
            </tr>
            <tr>
                <th></th>
                {#if !skipClasses['mage']}
                    <th class="icon">
                        <ClassIcon size={40} border={1} classId={8} />
                    </th>
                {/if}
                {#if !skipClasses['priest']}
                    <th class="icon">
                        <ClassIcon size={40} classId={5} />
                    </th>
                {/if}
                {#if !skipClasses['warlock']}
                    <th class="icon">
                        <ClassIcon size={40} classId={9} />
                    </th>
                {/if}
                {#if !skipClasses['demon-hunter']}
                    <th class="icon">
                        <ClassIcon size={40} classId={12} />
                    </th>
                {/if}
                {#if !skipClasses['druid']}
                    <th class="icon">
                        <ClassIcon size={40} classId={11} />
                    </th>
                {/if}
                {#if !skipClasses['monk']}
                    <th class="icon">
                        <ClassIcon size={40} classId={10} />
                    </th>
                {/if}
                {#if !skipClasses['rogue']}
                    <th class="icon">
                        <ClassIcon size={40} classId={4} />
                    </th>
                {/if}
                {#if !skipClasses['hunter']}
                    <th class="icon">
                        <ClassIcon size={40} classId={3} />
                    </th>
                {/if}
                {#if !skipClasses['shaman']}
                    <th class="icon">
                        <ClassIcon size={40} classId={7} />
                    </th>
                {/if}
                {#if !skipClasses['death-knight']}
                    <th class="icon">
                        <ClassIcon size={40} classId={6} />
                    </th>
                {/if}
                {#if !skipClasses['paladin']}
                    <th class="icon">
                        <ClassIcon size={40} classId={2} />
                    </th>
                {/if}
                {#if !skipClasses['warrior']}
                    <th class="icon">
                        <ClassIcon size={40} classId={1} />
                    </th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each categories as category}
                <TransmogTableCategory {category} {setKey} {skipClasses} />
            {/each}
        </tbody>
    </table>
</div>
