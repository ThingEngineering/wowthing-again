<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import {data as staticData} from '../../stores/static-store'

    import ReputationTableIcon from './TableHeadReputation.svelte'
    import CharacterTable from '../common/character-table/Table.svelte'
    import CharacterTableHead from '../common/CharacterTableHead.svelte'
    import ReputationTableCell from './TableRowReputation.svelte'

    export let slug: string

    $: category = find($staticData.ReputationSets, (r) => r.Slug === slug)
</script>

<CharacterTable endSpacer=false>
    <slot slot="colgroup">
        {#each category.Reputations as grouping}
            <colgroup span="{grouping.length}"></colgroup>
        {/each}
    </slot>

    <slot slot="head">
        <CharacterTableHead>
            {#key category.Name}
                {#each flatten(category.Reputations) as reputation}
                    <ReputationTableIcon reputation={reputation} />
                {/each}
            {/key}
        </CharacterTableHead>
    </slot>

    <slot slot="rowExtra">
        {#key category.Name}
            {#each flatten(category.Reputations) as reputation}
                <ReputationTableCell reputationSet={reputation} />
            {/each}
        {/key}
    </slot>
</CharacterTable>
