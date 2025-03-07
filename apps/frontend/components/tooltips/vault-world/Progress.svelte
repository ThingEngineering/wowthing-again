<script lang="ts">
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import { getWorldTier } from '@/utils/vault/get-world-tier';
    import type { CharacterWeeklyProgress } from '@/types';

    export let highlightLast = false;
    export let progress: CharacterWeeklyProgress;
    export let runCount: number;
    export let runIndex: number;
    export let runs: [number, string][];

    let cls: string;
    let dungeonName: string;
    let itemLevel: number;

    $: {
        if (progress.progress >= progress.threshold) {
            cls = 'vault-reward';
            dungeonName = progress.level > 1 ? 'Delves' : 'Activities/Delves';
            itemLevel = getWorldTier(progress.level)[0];
        } else {
            const more = progress.threshold - progress.progress;
            cls = 'vault-more';
            dungeonName = `Do ${more} more ${more === 1 ? 'activity/delve' : 'activities/delves'}`;
        }
    }
    $: progressRuns = runs.slice(runIndex * 2, runIndex * 2 + runCount);
</script>

<style lang="scss">
    .map-level {
        display: flex;
        gap: 0.2rem;
    }
</style>

<tr class={cls}>
    <td>
        {#if progress.level > 0}
            {progress.level}
        {/if}
    </td>
    <td class="dungeon-name">
        {#if progressRuns.length > 0}
            {@const remaining = progress.threshold - progress.progress}
            {#each progressRuns as [level, map], sighIndex}
                <div
                    class="map-level"
                    class:quality1={!highlightLast || sighIndex !== runCount - 1}
                >
                    {#if level && map}
                        <code>[{level}]</code>
                        {map}
                    {:else}
                        ???
                    {/if}
                </div>
            {/each}

            {#if remaining > 0}
                {dungeonName}
            {/if}
        {:else}
            {dungeonName}
        {/if}
    </td>
    {#if itemLevel}
        <td class="item-level quality{getItemLevelQuality(itemLevel)}">{itemLevel}</td>
    {:else}
        <td></td>
    {/if}
</tr>
