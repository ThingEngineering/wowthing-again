<script lang="ts">
    import find from 'lodash/find';

    import { keyTiers } from '@/data/dungeon';
    import { seasonMap } from '@/data/mythic-plus';
    import { timeStore } from '@/shared/stores/time';
    import { userStore } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import { getRunCounts } from '@/utils/dungeon';
    import type { CharacterMythicPlusAddonRun } from '@/types';

    export let slug: string;

    let runCounts: number[];
    let totalRuns: number;
    $: {
        const season = find(seasonMap, (season) => season.slug === slug);
        if (!season) {
            break $;
        }

        const allRuns: CharacterMythicPlusAddonRun[] = [];
        const characters = userState.general.visibleCharacters.filter(
            (char) => char.level >= season.minLevel
        );
        if (season.id < 10) {
            for (const character of characters) {
                allRuns.push(...(character.mythicPlusAddon?.[season.id]?.runs || []));
            }
        } else {
            for (const character of characters) {
                const startStamp = userStore
                    .getPeriodForCharacter($timeStore, character, seasonMap[season.id].startPeriod)
                    .startTime.toUnixInteger();

                const endStamp = userStore
                    .getCurrentPeriodForCharacter($timeStore, character)
                    .endTime.toUnixInteger();

                for (const [timestamp, weekRuns] of Object.entries(
                    character.mythicPlusWeeks || {}
                )) {
                    const weekStamp = parseInt(timestamp);
                    if (weekStamp > startStamp && weekStamp <= endStamp) {
                        allRuns.push(...weekRuns);
                    }
                }
            }
        }

        runCounts = getRunCounts(allRuns);
        totalRuns = runCounts.reduce((a, b) => a + b, 0);
    }
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 0.4rem;
        justify-content: flex-start;
    }
    .stats-box {
        background: var(--color-thing-background);
        margin-top: 0.5rem;
        padding: 0.1rem 0.3rem;
        white-space: nowrap;

        &:first-child {
            margin-right: 0.4rem;
        }
    }
</style>

{#if totalRuns > 0}
    <div class="flex-wrapper">
        <div class="stats-box border">Total: {totalRuns}</div>

        {#each runCounts as count, countIndex}
            <div class="stats-box border quality{Math.min(6, countIndex + 1)}-border">
                {keyTiers[countIndex]}: {count}
            </div>
        {/each}
    </div>
{/if}
