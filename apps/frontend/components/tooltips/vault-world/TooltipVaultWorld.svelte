<script lang="ts">
    import type { Character, CharacterWeeklyProgress } from '@/types'

    import Progress from './Progress.svelte';
    import Rewards from './Rewards.svelte';

    export let character: Character

    $: progress = character.weekly?.vault?.worldProgress || []
</script>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>World Vault</h5>
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each Array(3) as _, i}
                <Progress progress={progress[i]} />
            {/each}
        </tbody>
    </table>

    {#if character.weekly?.vaultHasRewards}
        <Rewards {character} />
    {/if}
</div>
