<script lang="ts">
    import type {Character, CharacterWeeklyProgress} from '@/types'

    import Run from './Run.svelte'

    export let character: Character

    let progress: CharacterWeeklyProgress[]
    let runs: number[][]
    $: {
        progress = character.weekly?.vault?.mythicPlusProgress
        runs = character.weekly?.vault?.mythicPlusRuns
    }
</script>

<div class="wowthing-tooltip">
    <h4>{character.name} M+ Vault</h4>
    <table class="vault-mythic-tooltip table-striped">
        <tbody>
            {#each Array(progress[2].threshold) as _, i}
                <Run index={i} run={runs[i]} {progress} />
            {/each}
        </tbody>
    </table>
</div>
