<script lang="ts">
    import type { Character, CharacterWeeklyProgress } from '@/types';

    import Progress from './TooltipVaultRaidProgress.svelte';
    import Rewards from './Rewards.svelte';

    export let character: Character;

    let progress: CharacterWeeklyProgress[];
    $: {
        progress = character.weekly?.vault?.raidProgress || [];
    }
</script>

<div class="wowthing-tooltip">
    <h4>{character.name} - Raid Vault</h4>
    <table class="table-tooltip-vault table-striped">
        <tbody>
            {#each { length: 3 }, i}
                <Progress progress={progress[i]} />
            {/each}
        </tbody>
    </table>

    {#if character.weekly?.vault.generatedRewards}
        <Rewards {character} />
    {:else if character.weekly?.vault.availableRewards}
        <div class="bottom">Visit your vault!</div>
    {/if}
</div>
