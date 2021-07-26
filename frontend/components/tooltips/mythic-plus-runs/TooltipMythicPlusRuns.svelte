<script lang="ts">
    import {dungeonMap} from '@/data/dungeon'
    import type {CharacterMythicPlusAddonMap, CharacterMythicPlusRun, Dungeon} from '@/types'

    import AddonData from './TooltipMythicPlusRunsAddonData.svelte'
    import Run from './TooltipMythicPlusRunsRun.svelte'

    export let addonMap: CharacterMythicPlusAddonMap
    export let dungeonId: number
    export let runs: CharacterMythicPlusRun[]

    let dungeon: Dungeon
    $: {
        dungeon = dungeonMap[dungeonId]
        runs = runs ?? []
    }
</script>

<div class="wowthing-tooltip">
    <h4>{dungeon.name}</h4>
    {#if addonMap}
        <AddonData {addonMap} />
    {/if}
    {#each runs as run}
        <Run {run} />
    {/each}
</div>
