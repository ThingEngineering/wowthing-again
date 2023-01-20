<script lang="ts">
    import type { CharacterWeeklyProgress } from '@/types'

    export let progresses: CharacterWeeklyProgress[]
    export let textFunc: (progress: CharacterWeeklyProgress) => string
</script>

<style lang="scss">
    span {
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
    {#each progresses as progress, progressIndex}
        {#if progress.progress >= progress.threshold}
            <span class="quality4">{textFunc(progress)}</span>
        {:else}
            <span
                class:ugh={
                    progressIndex > 0 &&
                    progresses[progressIndex-1].progress < progresses[progressIndex-1].threshold
                }
            >
                {progress.threshold - progress.progress} !
            </span>
        {/if}
    {/each}
</div>
