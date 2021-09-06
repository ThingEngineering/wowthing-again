<script lang="ts">
    import { getContext } from 'svelte'

    import type {Character, CharacterMythicPlusAddonMap, CharacterMythicPlusRun} from '@/types'
    import getMythicPlusRunQuality, { getMythicPlusRunQualityAffix } from '@/utils/get-mythic-plus-run-quality'
    import { tippyComponent } from '@/utils/tippy'

    import TooltipMythicPlusRuns from '@/components/tooltips/mythic-plus-runs/TooltipMythicPlusRuns.svelte'

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
        @include cell-width($width-mplus-dungeon, 0px, 0px);

        border-left: 1px solid $border-color;
        text-align: center;

        --padding: 0.4rem;
    }
    span {
        width: 50%;

        &.failed {
            color: #888;
        }
        &:first-child {
            padding-left: var(--padding);
        }
        &:last-child {
            padding-right: var(--padding);
        }
    }
    .flex-wrapper {
        justify-content: space-around;
    }
</style>

<td
    use:tippyComponent={{
        component: TooltipMythicPlusRuns,
        props: { addonMap, dungeonId, runs },
    }}
>
    <div class="flex-wrapper">
        {#if seasonId >= 6}
            {#if addonMap?.fortifiedScore}
                <span
                    class={getMythicPlusRunQualityAffix(
                        addonMap.fortifiedScore
                    )}>{addonMap.fortifiedScore.level}</span
                >
            {:else}
                <span class="quality0">--</span>
            {/if}

            {#if addonMap?.tyrannicalScore}
                <span
                    class={getMythicPlusRunQualityAffix(
                        addonMap.tyrannicalScore
                    )}>{addonMap.tyrannicalScore.level}</span
                >
            {:else}
                <span class="quality0">--</span>
            {/if}
        {:else}
            {#each runs as run}
                <span class={getMythicPlusRunQuality(run)}
                    >{run.keystoneLevel}</span
                >
            {/each}
        {/if}
    </div>
</td>
