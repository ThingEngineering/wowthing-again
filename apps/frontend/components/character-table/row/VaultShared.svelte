<script lang="ts">
    import { timeState } from '@/shared/state/time.svelte';
    import type { CharacterWeeklyProgress } from '@/types';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & {
        progresses: CharacterWeeklyProgress[];
        qualityFunc: (progress: CharacterWeeklyProgress) => number;
        textFunc: (progress: CharacterWeeklyProgress) => string;
    };
    let { character, progresses, qualityFunc = null, textFunc }: Props = $props();

    let generatedRewards = $derived(character.weekly?.vault?.generatedRewards);
    let availableRewards = $derived(
        character.weekly?.vault?.availableRewards ||
            (character.weekly?.vault?.anyThreshold &&
                character.weeklyReset < timeState.slowTime &&
                character.weeklyReset > character.weekly.vaultScannedTime)
    );
</script>

<style lang="scss">
    .collect {
        text-align: center;
        width: 100%;
    }
    .progress {
        display: inline-block;
        text-align: center;
        width: calc(var(--width-vault) / 3 - 0.2rem);
        word-spacing: -0.2ch;
    }
    .ugh {
        color: #aaa;
    }
</style>

<div class="flex-wrapper">
    {#if generatedRewards}
        <span class="collect status-warn">Choose!</span>
    {:else if availableRewards}
        <span class="collect status-warn">Visit!</span>
    {:else}
        {#each progresses as progress, progressIndex}
            {#if progress.progress >= progress.threshold}
                <span class="progress quality{qualityFunc?.(progress) || 4}"
                    >{textFunc(progress)}</span
                >
            {:else}
                <span
                    class="progress"
                    class:ugh={progressIndex > 0 &&
                        progresses[progressIndex - 1].progress <
                            progresses[progressIndex - 1].threshold}
                >
                    {progress.threshold - progress.progress} !
                </span>
            {/if}
        {/each}
    {/if}
</div>
