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

    div {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;
        padding: 0.5rem 0 0.5rem 0.5rem;
    }
    table {
    }
    colgroup:nth-child(even) {
        background: lighten($thing-background, 8%);
    }
</style>

<div>
    <table>
        <colgroup span="2"></colgroup>
        {#each category.Reputations as grouping}
            <colgroup span="{grouping.length}"></colgroup>
        {/each}
        <thead>
            <tr>
                <th colspan="2"></th>
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
</div>
