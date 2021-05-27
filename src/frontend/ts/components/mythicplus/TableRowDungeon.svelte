<script lang="ts">
    import {getContext} from 'svelte'

    import type {Character, CharacterMythicPlusRun} from '@/types'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'
    import getMythicPlusRunTooltip from '@/utils/get-mythic-plus-run-tooltip'
    import tippy from '@/utils/tippy'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]

    const character: Character = getContext('character')

    let runs: CharacterMythicPlusRun[]
    let tooltip: object
    $: {
        runs = runsFunc(character, dungeonId) ?? []
        if (runs.length === 2 && runs[1].keystoneLevel <= runs[0].keystoneLevel) {
            runs = [runs[0]]
        }
        if (runs.length > 0) {
            tooltip = getMythicPlusRunTooltip(runs)
        }
    }
</script>

<style lang="scss">
    @import 'scss/variables';

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

{#if runs.length > 0}
    <td use:tippy={tooltip}>
        {#each runs as run}
            <span class="{ getMythicPlusRunQuality(run) }">
                {run.keystoneLevel}
            </span>
        {/each}
    </td>
{:else}
    <td></td>
{/if}
