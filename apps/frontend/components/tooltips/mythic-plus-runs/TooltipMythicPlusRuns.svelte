<script lang="ts">
    import { dungeonMap } from '@/data/dungeon';
    import type {
        Character,
        CharacterMythicPlusAddonMap,
        CharacterMythicPlusAddonRun,
        CharacterMythicPlusRun,
        Dungeon,
        MythicPlusSeason,
    } from '@/types';

    import AddonData from './TooltipMythicPlusRunsAddonData.svelte';
    import Run from './TooltipMythicPlusRunsRun.svelte';

    export let addonMap: CharacterMythicPlusAddonMap;
    export let allRuns: CharacterMythicPlusAddonRun[];
    export let character: Character;
    export let dungeonId: number;
    export let runs: CharacterMythicPlusRun[];
    export let season: MythicPlusSeason;

    let dungeon: Dungeon;
    $: {
        dungeon = dungeonMap[dungeonId];
        runs = runs ?? [];
    }
</script>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{dungeon.name}</h5>

    <AddonData {addonMap} {allRuns} {season} />

    {#each runs as run}
        <Run {run} />
    {/each}
</div>
