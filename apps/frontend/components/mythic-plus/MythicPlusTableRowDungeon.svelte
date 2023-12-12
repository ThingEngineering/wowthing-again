<script lang="ts">
    import maxBy from 'lodash/maxBy'
    import { getContext } from 'svelte'
    
    import { getRunQuality, getRunQualityAffix, getWeeklyAffixes } from '@/utils/mythic-plus'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type {
        Character,
        CharacterMythicPlusAddonMap,
        CharacterMythicPlusAddonRun,
        CharacterMythicPlusRun
    } from '@/types'

    import TooltipMythicPlusRuns from '@/components/tooltips/mythic-plus-runs/TooltipMythicPlusRuns.svelte'

    export let dungeonId: number
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[]
    export let seasonId: number

    const character: Character = getContext('character')

    let addonMap: CharacterMythicPlusAddonMap
    let allRuns: CharacterMythicPlusAddonRun[]
    let isTyrannical: boolean
    let runs: CharacterMythicPlusRun[]
    let showBoth: boolean
    $: {
        const affixes = getWeeklyAffixes(character)
        isTyrannical = affixes[0]?.name === 'Tyrannical'

        runs = runsFunc(character, dungeonId) ?? []
        // If there are 2 runs and the second run isn't higher than the first, discard it
        if (runs.length === 2 && runs[1].keystoneLevel <= runs[0].keystoneLevel) {
            runs = [runs[0]]
        }

        const tempMap: CharacterMythicPlusAddonMap =
                character.mythicPlusSeasons?.[seasonId]?.[dungeonId] ||
                character.mythicPlusAddon?.[seasonId]?.maps?.[dungeonId]

        if (tempMap) {
            showBoth = seasonId >= 6
            if (tempMap.fortifiedScore || tempMap.tyrannicalScore) {
                addonMap = tempMap
                //allRuns = character.mythicPlusAddon[seasonId].runs
                //    .filter((run) => run.mapId === dungeonId)
            }
        }
    }

    $: bestRun = maxBy(
        runs || [],
        (run) => (run.keystoneLevel * 10) + (run.timed ? 0 : 1)
    )
</script>

<style lang="scss">
    td {
        @include cell-width($width-mplus-dungeon, 0px, 0px);

        border-left: 1px solid $border-color;
        text-align: center;

        --active-background: rgba(0, 0, 0, 0.5);
        --inactive-opacity: 0.8;

        &.fortified {
            span:first-child {
                background: var(--active-background);
            }
            span:last-child {
                opacity: var(--inactive-opacity);
            }
        }
        &.tyrannical {
            span:first-child {
                opacity: var(--inactive-opacity);
            }
            span:last-child {
                background: var(--active-background);
            }
        }
    }
    span {
        width: 50%;

        &.failed {
            color: #888;
        }
    }
    .flex-wrapper {
        justify-content: space-around;
    }
</style>

<td
    class:fortified={!isTyrannical}
    class:tyrannical={isTyrannical}
    use:componentTooltip={{
        component: TooltipMythicPlusRuns,
        props: {
            addonMap,
            allRuns,
            character,
            dungeonId,
            runs,
        },
    }}
>
    <div class="flex-wrapper">
        {#if showBoth}
            {#if addonMap?.fortifiedScore}
                <span
                    class="{getRunQualityAffix(addonMap.fortifiedScore)}"
                >{addonMap.fortifiedScore.level}</span>
            {:else}
                <span class="quality0">--</span>
            {/if}

            {#if addonMap?.tyrannicalScore}
                <span
                    class={getRunQualityAffix(addonMap.tyrannicalScore)}
                >{addonMap.tyrannicalScore.level}</span>
            {:else}
                <span class="quality0">--</span>
            {/if}
        {:else if bestRun}
            <span class={getRunQuality(bestRun)}>
                {bestRun.keystoneLevel}
            </span>
            
            {#if runs.length > 1}
                ({runs.length - 1})
            {/if}
        {/if}
    </div>
</td>
