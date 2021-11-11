<script lang="ts">
    import find from 'lodash/find'

    import { staticStore } from '@/stores/static'
    import type { StaticDataProgressCategory } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadProgress from './ProgressTableHead.svelte'
    import RowCovenant from '@/components/home/table/row/HomeTableRowCovenant.svelte'
    import RowProgress from './ProgressTableBody.svelte'

    export let slug: string

    let categories: StaticDataProgressCategory[]
    $: {
        categories = find($staticStore.data.progress, (p) => p !== null && p[0].slug === slug)
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

<CharacterTable>
    <CharacterTableHead slot="head">
        {#key slug}
            {#if slug === 'shadowlands'}
                <th></th>
            {/if}

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
