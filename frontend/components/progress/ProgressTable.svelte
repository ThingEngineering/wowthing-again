<script lang="ts">
    import find from 'lodash/find'
    import some from 'lodash/some'

    import { userQuestStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import type { Character, StaticDataProgressCategory } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadProgress from './ProgressTableHead.svelte'
    import RowCovenant from '@/components/home/table/row/HomeTableRowCovenant.svelte'
    import RowProgress from './ProgressTableBody.svelte'

    export let slug: string

    let categories: StaticDataProgressCategory[]
    let filterFunc: (char: Character) => boolean
    $: {
        categories = find($staticStore.data.progress, (p) => p !== null && p[0].slug === slug)

        if (categories[0].requiredQuestIds.length > 0) {
            filterFunc = (char: Character) => some(
                categories[0].requiredQuestIds,
                (id) => $userQuestStore.data.characters[char.id]?.quests?.has(id)
            )
        }
        else {
            filterFunc = null
        }
    }
</script>

<style lang="scss">
    .spacer {
        background: $body-background;
        border-bottom-width: 0 !important;
        border-left: 1px solid $border-color;
        border-top-width: 0 !important;
        width: 1rem;
    }
</style>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        {#key slug}
            {#if slug === 'shadowlands'}
                <th></th>
            {/if}

            <th class="spacer"></th>

            {#each categories as category}
                {#if category === null}
                    <th class="spacer"></th>
                {:else}
                    {#each category.groups as group}
                        <HeadProgress {group} />
                    {/each}
                {/if}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#if slug === 'shadowlands'}
                <RowCovenant {character} />
            {/if}

            <td class="spacer"></td>

            {#each categories as category}
                {#if category === null}
                    <td class="spacer"></td>
                {:else}
                    {#each category.groups as group}
                        <RowProgress
                            {character}
                            {category}
                            {group}
                        />
                    {/each}
                {/if}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
