<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    import Progress from './TooltipVaultRaidProgress.svelte';
    import Rewards from './Rewards.svelte';

    let { character }: CharacterProps = $props();

    let progress = $derived(character.weekly?.vault?.raidProgress || []);
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
