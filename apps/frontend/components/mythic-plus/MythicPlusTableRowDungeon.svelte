<script lang="ts">
    import maxBy from 'lodash/maxBy';
    import { getContext } from 'svelte';

    import { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getRunQuality, getRunQualityAffix, getWeeklyAffixes } from '@/utils/mythic-plus';
    import type {
        Character,
        CharacterMythicPlusAddonMap,
        CharacterMythicPlusAddonRun,
        CharacterMythicPlusRun,
        MythicPlusSeason,
    } from '@/types';

    import TooltipMythicPlusRuns from '@/components/tooltips/mythic-plus-runs/TooltipMythicPlusRuns.svelte';

    export let dungeonId: number;
    export let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[];
    export let season: MythicPlusSeason;

    const character: Character = getContext('character');

    let addonMap: CharacterMythicPlusAddonMap;
    let allRuns: CharacterMythicPlusAddonRun[];
    let bestRun: CharacterMythicPlusRun;
    let hasPortal: boolean;
    let isTyrannical: boolean;
    let runs: CharacterMythicPlusRun[];
    let showBoth: boolean;
    $: {
        const affixes = getWeeklyAffixes(character);
        isTyrannical = affixes[0]?.name === 'Tyrannical';

        runs = runsFunc(character, dungeonId) ?? [];
        // If there are 2 runs and the second run isn't higher than the first, discard it
        if (runs.length === 2 && runs[1].keystoneLevel <= runs[0].keystoneLevel) {
            runs = [runs[0]];
        }

        const tempMap: CharacterMythicPlusAddonMap =
            character.mythicPlusSeasons?.[season?.id]?.[dungeonId] ||
            character.mythicPlusAddon?.[season?.id]?.maps?.[dungeonId];

        if (tempMap) {
            showBoth = season.scoreType === MythicPlusScoreType.FortifiedTyrannical;
            if (tempMap.fortifiedScore || tempMap.tyrannicalScore) {
                addonMap = tempMap;
                hasPortal =
                    Math.max(
                        tempMap.fortifiedScore?.overTime === false
                            ? tempMap.fortifiedScore.level
                            : 0,
                        tempMap.tyrannicalScore?.overTime === false
                            ? tempMap.tyrannicalScore.level
                            : 0
                    ) >= season.portalLevel;
                //allRuns = character.mythicPlusAddon[seasonId].runs
                //    .filter((run) => run.mapId === dungeonId)
            }
        }
    }

    $: {
        bestRun = maxBy(runs || [], (run) => run.keystoneLevel * 10 + (run.timed ? 0 : 1));
        if (!addonMap) {
            hasPortal = bestRun?.timed && bestRun.keystoneLevel >= season?.portalLevel;
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-mplus-dungeon, 0px, 0px);

        border-left: 1px solid var(--border-color);
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
        &.portal {
            box-shadow: inset 0 0 0 1px #{$quality5-border};
        }
    }
    span {
        width: 2rem;

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
    class:portal={hasPortal}
    use:componentTooltip={{
        component: TooltipMythicPlusRuns,
        props: {
            addonMap,
            allRuns,
            character,
            dungeonId,
            runs,
            season,
        },
    }}
>
    <div class="flex-wrapper">
        {#if showBoth}
            {#if addonMap?.fortifiedScore}
                <span class={getRunQualityAffix(addonMap.fortifiedScore)}
                    >{addonMap.fortifiedScore.level}</span
                >
            {:else}
                <span class="quality0">--</span>
            {/if}

            {#if addonMap?.tyrannicalScore}
                <span class={getRunQualityAffix(addonMap.tyrannicalScore)}
                    >{addonMap.tyrannicalScore.level}</span
                >
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
