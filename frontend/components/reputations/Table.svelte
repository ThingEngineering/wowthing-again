<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import {data as staticData} from '@/stores/static'

    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import Head from '@/components/common/character-table/Head.svelte'
    import HeadReputation from './TableHeadReputation.svelte'
    import RowReputation from './TableRowReputation.svelte'

    export let slug: string

    $: category = find($staticData.ReputationSets, (r) => r.Slug === slug)
</script>

<CharacterTable endSpacer={false}>
    <slot slot="colgroup">
        {#each category.Reputations as grouping}
            <colgroup span="{grouping.length}"></colgroup>
        {/each}
    </slot>

    <slot slot="head">
        <Head>
            {#key category.Name}
                {#each flatten(category.Reputations) as reputation}
                    <HeadReputation {reputation} />
                {/each}
            {/key}
        </Head>
    </slot>

    <slot slot="rowExtra">
        {#key category.Name}
            {#each flatten(category.Reputations) as reputation}
                <RowReputation {reputation} />
            {/each}
        {/key}
    </slot>
</CharacterTable>
