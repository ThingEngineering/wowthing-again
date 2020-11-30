<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import {data as staticData} from '../../stores/static-store'
    import {data as userData} from '../../stores/user-store'
    import ReputationTableIcon from './ReputationTableIcon.svelte'
    import ReputationTableRow from './ReputationTableRow.svelte'

    export let slug: string

    $: category = find($staticData.ReputationSets, (r) => r.Slug === slug)
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    table {
        background: $thing-background;
        border: 1px solid $border-color;
        table-layout: fixed;
        width: 100%;
    }
    th {
        border-bottom: 1px solid $border-color;
    }
    colgroup:nth-child(even) {
        background: darken($thing-background, 3%);
    }
    .name {
        width: 9rem;
    }
    .realm {
        width: 9rem;
    }
</style>

<table>
    <colgroup span="2"></colgroup>
    {#each category.Reputations as grouping}
        <colgroup span="{grouping.length}"></colgroup>
    {/each}
    <thead>
        <tr>
            <th class="name"></th>
            <th class="realm"></th>
            {#key category.Name}
                {#each flatten(category.Reputations) as reputation}
                    <ReputationTableIcon reputation={reputation} />
                {/each}
            {/key}
        </tr>
    </thead>
    <tbody>
        {#each $userData.characters as character}
            <ReputationTableRow category={category} character={character} />
        {/each}
    </tbody>
</table>
