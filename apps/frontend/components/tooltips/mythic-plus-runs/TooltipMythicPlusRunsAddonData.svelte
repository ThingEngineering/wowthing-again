<script lang="ts">
    import { keyTiers } from '@/data/dungeon';
    import { getRunCounts } from '@/utils/dungeon';
    import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores';
    import type {
        CharacterMythicPlusAddonMap,
        CharacterMythicPlusAddonRun,
        MythicPlusSeason,
    } from '@/types';
    import { MythicPlusScoreType } from '@/enums/mythic-plus-score-type';

    export let addonMap: CharacterMythicPlusAddonMap;
    export let allRuns: CharacterMythicPlusAddonRun[];
    export let season: MythicPlusSeason;

    $: runCounts = getRunCounts(allRuns);
</script>

<style lang="scss">
    .addon-wrapper {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        padding: 0 1rem;
        width: 20rem;
    }
    .runs-wrapper {
        flex-wrap: wrap;
    }
    .data-box {
        background: $thing-background;
        padding: 0.2rem 0.4rem;
        white-space: nowrap;
    }
</style>

<div class="addon-wrapper">
    {#if season.scoreType === MythicPlusScoreType.FortifiedTyrannical}
        {@const scores = getDungeonScores(addonMap)}
        <div class="data-box border">
            Total: {scores.fortifiedFinal + scores.tyrannicalFinal}
        </div>
        <div
            class="data-box border"
            class:border-fail={scores.fortifiedInitial === 0}
            class:border-shrug={scores.fortifiedInitial > 0 &&
                scores.fortifiedInitial < scores.tyrannicalInitial}
            class:border-success={scores.fortifiedInitial > 0 &&
                scores.fortifiedInitial > scores.tyrannicalInitial}
        >
            Fort: {scores.fortifiedInitial}
        </div>
        <div
            class="data-box border"
            class:border-fail={scores.tyrannicalInitial === 0}
            class:border-shrug={scores.tyrannicalInitial > 0 &&
                scores.tyrannicalInitial < scores.fortifiedInitial}
            class:border-success={scores.tyrannicalInitial > 0 &&
                scores.tyrannicalInitial > scores.fortifiedInitial}
        >
            Tyr: {scores.tyrannicalInitial}
        </div>
    {:else}
        <div class="data-box border">
            Total: {addonMap?.overallScore || 0}
        </div>
    {/if}
</div>

{#if runCounts.length > 0}
    <div class="addon-wrapper runs-wrapper">
        {#each runCounts as count, countIndex}
            {#if count > 0}
                <div class="data-box border quality{Math.min(5, countIndex + 1)}-border">
                    {keyTiers[countIndex]}: {count}
                </div>
            {/if}
        {/each}
    </div>
{/if}
