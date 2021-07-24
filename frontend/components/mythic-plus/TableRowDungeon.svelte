<script lang="ts">
    import { getContext } from 'svelte'

    import type {Character, CharacterMythicPlusAddonMap, CharacterMythicPlusRun} from '@/types'
    import getMythicPlusRunQuality, { getMythicPlusRunQualityAffix } from '@/utils/get-mythic-plus-run-quality'
    import { tippyComponent } from '@/utils/tippy'

    import MythicPlusRunsTooltip from '@/tooltips/mythic-plus-runs/Tooltip.svelte'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    export let seasonId: number

    const character: Character = getContext('character')

    let addonMap: CharacterMythicPlusAddonMap
    let runs: CharacterMythicPlusRun[]
    $: {
        runs = runsFunc(character, dungeonId) ?? []
        // If there are 2 runs and the second run isn't higher than the first, discard it
        if (runs.length === 2 && runs[1].keystoneLevel <= runs[0].keystoneLevel) {
            runs = [runs[0]]
        }

        if (character.mythicPlusAddon?.season === seasonId) {
            const tempMap: CharacterMythicPlusAddonMap = character.mythicPlusAddon.maps[dungeonId]
            if (tempMap.fortifiedScore || tempMap.tyrannicalScore) {
                addonMap = tempMap
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-mplus-dungeon);

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

{#if runs.length > 0 || addonMap}
    <td use:tippyComponent={{component: MythicPlusRunsTooltip, props: {addonMap, runs}}}>
        {#if addonMap}
            {#if addonMap.fortifiedScore}
                <span class={getMythicPlusRunQualityAffix(addonMap.fortifiedScore)}>{addonMap.fortifiedScore.level}</span>
            {:else}
                <span class="quality0">--</span>
            {/if}

            {#if addonMap.tyrannicalScore}
                <span class={getMythicPlusRunQualityAffix(addonMap.tyrannicalScore)}>{addonMap.tyrannicalScore.level}</span>
            {:else}
                <span class="quality0">--</span>
            {/if}
        {:else}
            {#each runs as run}
                <span class={getMythicPlusRunQuality(run)}>{run.keystoneLevel}</span>
            {/each}
        {/if}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
