<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import {transmogStore} from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import type {Dictionary} from '@/types'
    import type {TransmogDataCategory} from '@/types/data'
    import getSkipClasses from '@/utils/get-skip-classes'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import TransmogTableCategory from './TransmogTableCategory.svelte'

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
