<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import { data as staticData } from '@/stores/static'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import Head from '@/components/character-table/Head.svelte'
    import HeadReputation from './TableHeadReputation.svelte'
    import RowReputation from './TableRowReputation.svelte'

    export let slug: string

    $: category = find($staticData.reputationSets, (r) => r.slug === slug)
</script>

<CharacterTable endSpacer={false}>
    <slot slot="head">
        <Head>
            {#key category.name}
                {#each flatten(category.reputations) as reputation}
                    <HeadReputation {reputation} />
                {/each}
            {/key}
        </Head>
    </slot>

    <slot slot="rowExtra">
        {#key category.name}
            {#each flatten(category.reputations) as reputation}
                <RowReputation {reputation} />
            {/each}
        {/key}
    </slot>
</CharacterTable>
