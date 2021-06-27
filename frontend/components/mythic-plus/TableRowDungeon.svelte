<script lang="ts">
    import { getContext } from 'svelte'

    import type { Character, CharacterMythicPlusRun } from '@/types'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'
    import { tippyComponent } from '@/utils/tippy'

    import MythicPlusRunsTooltip from '@/tooltips/mythic-plus-runs/Tooltip.svelte'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]

    const character: Character = getContext('character')

    let runs: CharacterMythicPlusRun[]
    $: {
        runs = runsFunc(character, dungeonId) ?? []
        // If there are 2 runs and the second run isn't higher than the first, discard it
        if (runs.length === 2 && runs[1].keystoneLevel <= runs[0].keystoneLevel) {
            runs = [runs[0]]
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
    span {
        &.failed {
            color: #888;
        }
        &:nth-child(2) {
            padding-left: 0.4rem;
        }
    }
</style>

{#if runs.length > 0}
    <td use:tippyComponent={{component: MythicPlusRunsTooltip, props: {runs}}}>
        {#each runs as run}
            <span class={getMythicPlusRunQuality(run)}>{run.keystoneLevel}</span>
        {/each}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
