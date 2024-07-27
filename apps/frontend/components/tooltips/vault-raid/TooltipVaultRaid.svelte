<script lang="ts">
    import type { Character, CharacterWeeklyProgress } from '@/types'

    import Progress from './TooltipVaultRaidProgress.svelte'
    import Rewards from './Rewards.svelte';

    export let character: Character

    let progress: CharacterWeeklyProgress[]
    $: {
        progress = character.weekly?.vault?.raidProgress || []
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

    {#if character.weekly?.vaultHasRewards}
        <Rewards {character} />
    {/if}
</div>
