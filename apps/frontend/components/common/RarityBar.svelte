<script lang="ts">
    import { ItemQuality } from '@/enums/item-quality';

    export let qualities: number[];
    export let total = 100;

    let tooltip: string;
    $: {
        const parts: string[] = [];
        for (let quality = 0; quality < qualities.length; quality++) {
            parts.push(
                `<div style="display:flex;gap:1.5rem;justify-content:space-between;"><span class="quality${quality}">${ItemQuality[quality]}</span><span>${qualities[quality]}</span></div>`
            );
        }
        tooltip = parts.join('');
    }
</script>

<style lang="scss">
    .progress-container {
        background: var(--color-body-background);
        border: var(--bar-border-width, 1px) solid var(--bar-border-color, var(--border-color));
        display: flex;
        margin-top: var(--progress-margin-top, 0);
        overflow: hidden;
        padding: 2px;
        position: relative;
        width: 100%;
    }
    .progress-bar {
        background: var(--bar-border-color);
        height: var(--bar-height, 2rem);
        width: 100%;

        &:not(:first-child) {
            border-left: 1px solid var(--border-color);
        }
    }
</style>

<button class="progress-container" data-tooltip={tooltip} on:click on:keypress>
    {#each qualities as haveQuality, quality}
        <div
            class="progress-bar quality{quality}-border"
            style:width={`${(haveQuality / total) * 100}%`}
        ></div>
    {/each}
</button>
