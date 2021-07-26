<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import type {Character, CharacterWeeklyProgress} from '@/types'

    import Run from './TooltipVaultMythicPlusRun.svelte'

    export let character: Character

    let progress: CharacterWeeklyProgress[]
    let runs: number[][]
    $: {
        progress = character.weekly?.vault?.mythicPlusProgress
        runs = sortBy(character.weekly?.vault?.mythicPlusRuns || [], (run: number[]) => -run[1])
    }
</script>

<div class="wowthing-tooltip">
    <h4>{character.name} - M+ Vault</h4>
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each Array(progress[2].threshold) as _, i}
                <Run index={i} run={runs[i]} {progress} />
            {/each}
        </tbody>
    </table>
</div>
