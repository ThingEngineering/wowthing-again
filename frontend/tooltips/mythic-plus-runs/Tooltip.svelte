<script lang="ts">
    import {dungeonMap} from '@/data/dungeon'
    import type {CharacterMythicPlusAddonMap, CharacterMythicPlusRun, Dungeon} from '@/types'

    import AddonData from './AddonData.svelte'
    import Run from './Run.svelte'

    export let addonMap: CharacterMythicPlusAddonMap
    export let runs: CharacterMythicPlusRun[]

    let dungeon: Dungeon
    $: {
        dungeon = dungeonMap[runs[0].dungeonId]
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
