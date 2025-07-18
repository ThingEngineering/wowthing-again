<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { timeStore } from '@/shared/stores/time';
    import { worldVaultItemLevel } from '@/data/dungeon';
    import { leftPad } from '@/utils/formatting';
    import { getNextWeeklyResetFromTime } from '@/utils/get-next-reset';
    import { getWorldTier } from '@/utils/vault/get-world-tier';
    import type { Character } from '@/types';

    import Progress from './Progress.svelte';
    import Rewards from './Rewards.svelte';

    export let character: Character;

    $: progress = character.weekly?.vault?.worldProgress || [];

    let improve: [string, number, number][];
    $: {
        const [currentItemLevel] = getWorldTier(progress[0].level);
        const betterOptions = worldVaultItemLevel.filter(
            ([, itemLevel]) => itemLevel > currentItemLevel,
        );
        improve = [];
        for (let i = betterOptions.length - 1; i >= 0; i--) {
            const [betterTier, betterItemLevel, quality] = betterOptions[i];
            let tierRange = betterTier.toString();
            if (betterOptions[i - 1] && betterOptions[i - 1][0] - betterTier > 1) {
                tierRange = `${betterTier} - ${betterOptions[i - 1][0] - 1}`;
            }

            improve.push([tierRange, betterItemLevel, quality]);
            if (improve.length === 3) {
                break;
            }
        }
    }

    let runs: [number, string][];
    $: {
        runs = [];
        if (character.weekly?.delves) {
            const nextReset = getNextWeeklyResetFromTime(
                $timeStore,
                character.realm.region,
            ).toUnixInteger();
            if (Math.abs(character.weekly.delveWeek - nextReset) < 5) {
                runs = sortBy(character.weekly.delves, ([level]) => leftPad(11 - level, 2, '0'));
            }

            for (let i = runs.length; i < progress[2].progress; i++) {
                runs.push([1, 'Activities/Delves']);
            }
        }
    }

    function getRunCount(index: number): number {
        if (progress[index]) {
            return progress[index].threshold - (progress[index - 1]?.threshold || 0);
        } else {
            return index < 2 ? 2 : 4;
        }
    }
</script>

<style lang="scss">
    .view {
        gap: 1rem;
    }
    .level-range {
        word-spacing: -0.3ch;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>World Vault</h5>

    <div class="view">
        <table class="table-tooltip-vault table-striped" class:border-right={improve.length > 0}>
            <tbody>
                {#each { length: 3 }, i}
                    <Progress
                        highlightLast={true}
                        progress={progress[i]}
                        runCount={getRunCount(i)}
                        runIndex={i}
                        {runs}
                    />
                {/each}
            </tbody>
        </table>

        {#if improve.length > 0}
            {@const useImprove = improve.slice(0, 3)}
            <table class="table-striped border-left border-bottom" style="margin-bottom: -1px;">
                <tbody>
                    {#each useImprove as [levelRange, itemLevel, quality] (itemLevel)}
                        <tr>
                            <td class="level-range">
                                {levelRange}
                            </td>
                            <td class="quality{quality}">{itemLevel}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

    {#if character.weekly?.vault.generatedRewards}
        <Rewards {character} />
    {:else if character.weekly?.vault.availableRewards}
        <div class="bottom">Visit your vault!</div>
    {/if}
</div>
