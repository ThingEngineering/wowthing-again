<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import {getContext} from 'svelte'

    import type {Character} from '../../types'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => []

    const character: Character = getContext('character')

    let sortedRuns
    $: {
        sortedRuns = sortBy(runsFunc(character, dungeonId), (r) => !r.timed)
        if (sortedRuns.length === 2 && sortedRuns[1].keystoneLevel <= sortedRuns[0].keystoneLevel) {
            sortedRuns = [sortedRuns[0]]
        }
    }

</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
    span+span:before {
        color: #888;
        content: " / ";
    }
    span.failed {
        color: #888;
    }
</style>

<td>
    {#each sortedRuns as run}
        <span
            class:failed={!run.timed}
            class:quality2={run.timed && run.keystoneLevel >= 4 && run.keystoneLevel < 7}
            class:quality3={run.timed && run.keystoneLevel >= 7 && run.keystoneLevel < 10}
            class:quality4={run.timed && run.keystoneLevel >= 10 && run.keystoneLevel < 15}
            class:quality5={run.timed && run.keystoneLevel >= 15}
        >
            {run.keystoneLevel}
        </span>
    {:else}
        &nbsp;
    {/each}
</td>
