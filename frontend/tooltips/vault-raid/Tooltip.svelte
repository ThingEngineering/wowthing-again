<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import type {Character, CharacterWeeklyProgress} from '@/types'

    import Progress from './Progress.svelte'

    export let character: Character

    let progress: CharacterWeeklyProgress[]
    let runs: number[][]
    $: {
        progress = character.weekly?.vault?.raidProgress
        runs = sortBy(character.weekly?.vault?.mythicPlusRuns || [], (run: number[]) => -run[1])
    }
</script>

<div class="wowthing-tooltip">
    <h4>{character.name} - Raid Vault</h4>
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each Array(3) as _, i}
                <Progress progress={progress[i]} />
            {/each}
        </tbody>
    </table>
</div>
