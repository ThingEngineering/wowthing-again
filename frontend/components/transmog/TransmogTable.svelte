<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import {transmogStore} from '@/stores'
    import type {TransmogDataCategory} from '@/types/data'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import TransmogTableCategory from './TransmogTableCategory.svelte'

    export let slug: string

    let categories: TransmogDataCategory[]
    $: {
        categories = filter(
            find($transmogStore.data.sets, (s) => s[0].slug === slug),
            (s) => s.groups.length > 0 && s.groups[0].type !== null
        )
        console.log(slug, categories)
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
                <th colspan="3">Cloth</th>
                <th colspan="4">Leather</th>
                <th colspan="2">Mail</th>
                <th colspan="3">Plate</th>
            </tr>
            <tr>
                <th></th>
                <th class="icon">
                    <ClassIcon size={40} border={1} classId={8} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={5} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={9} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={12} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={11} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={10} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={4} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={3} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={7} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={6} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={2} />
                </th>
                <th class="icon">
                    <ClassIcon size={40} classId={1} />
                </th>
            </tr>
        </thead>
        <tbody>
            {#each categories as category}
                <TransmogTableCategory {category} />
            {/each}
        </tbody>
    </table>
</div>
