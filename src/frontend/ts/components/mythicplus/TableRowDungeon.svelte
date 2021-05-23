<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import {getContext} from 'svelte'

    import type {Character, CharacterMythicPlusRun} from '../../types'
    import getMythicPlusRunQuality from '../../utils/get-mythic-plus-run-quality'
    import getMythicPlusRunTooltip from '../../utils/get-mythic-plus-run-tooltip'
    import tippy from '../../utils/tippy'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]

    const character: Character = getContext('character')

    let sortedRuns: CharacterMythicPlusRun[]
    let tooltip: object
    $: {
        sortedRuns = sortBy(runsFunc(character, dungeonId), (r) => !r.timed)
        if (sortedRuns.length === 2 && sortedRuns[1].keystoneLevel <= sortedRuns[0].keystoneLevel) {
            sortedRuns = [sortedRuns[0]]
        }
        if (sortedRuns.length > 0) {
            tooltip = getMythicPlusRunTooltip(sortedRuns)
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

{#if sortedRuns.length > 0}
    <td use:tippy={tooltip}>
        {#each sortedRuns as run}
            <span class="{ getMythicPlusRunQuality(run) }">
                {run.keystoneLevel}
            </span>
        {/each}
    </td>
{:else}
    <td></td>
{/if}
