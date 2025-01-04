<script lang="ts">
    import type { CharacterWeeklyProgress } from '@/types'

    export let availableRewards: boolean
    export let generatedRewards: boolean
    export let progresses: CharacterWeeklyProgress[]
    export let qualityFunc: (progress: CharacterWeeklyProgress) => number = null
    export let textFunc: (progress: CharacterWeeklyProgress) => string
</script>

<style lang="scss">
    .collect {
        text-align: center;
        width: 100%;
    }
    .progress {
        display: inline-block;
        text-align: center;
        width: calc(#{$width-vault} / 3 - 0.2rem);
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
                <span class="progress quality{qualityFunc?.(progress) || 4}">{textFunc(progress)}</span>
            {:else}
                <span
                    class="progress"
                    class:ugh={
                        progressIndex > 0 &&
                        progresses[progressIndex-1].progress < progresses[progressIndex-1].threshold
                    }
                >
                    {progress.threshold - progress.progress} !
                </span>
            {/if}
        {/each}
    {/if}
</div>
