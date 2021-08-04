<script lang="ts">
    import find from 'lodash/find'

    import { data as staticData } from '@/stores/static'
    import type {StaticDataProgressCategory, StaticDataProgressGroup} from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadProgress from './ProgressTableHead.svelte'
    import RowProgress from './ProgressTableBody.svelte'

    export let slug: string

    let category: StaticDataProgressCategory
    $: {
        category = find($staticData.progress, (c: StaticDataProgressCategory) => c.slug === slug)
        console.log(category)
    }
</script>

<style lang="scss">

</style>

<CharacterTable endSpacer={false}>
    <CharacterTableHead slot="head">
        {#key slug}
            {#each category.groups as group}
                <HeadProgress {group} />
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#each category.groups as group}
                <RowProgress {character} {group} />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
