<script lang="ts">
    import {dungeonMap} from '@/data/dungeon'
    import type {CharacterMythicPlusRun, Dungeon} from '@/types'

    import Run from './Run.svelte'

    export let runs: CharacterMythicPlusRun[]

    let dungeon: Dungeon
    $: {
        dungeon = dungeonMap[runs[0].dungeonId]
    }
</script>

<div class="wowthing-tooltip">
    <h4>{dungeon.name}</h4>
    {#each runs as run}
        <Run {run} />
    {/each}
</div>
