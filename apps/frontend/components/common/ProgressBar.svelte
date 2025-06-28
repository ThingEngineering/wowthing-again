<script lang="ts">
    import { iconStrings } from '@/data/icons';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { toNiceNumber } from '@/utils/formatting';

    export let cls: string = null;
    export let title: string = null;
    export let have = Math.floor(Math.random() * 100);
    export let midText: string = undefined;
    export let selected = false;
    export let shortText = false;
    export let textCls: string = null;
    export let total = 100;
</script>

<style lang="scss">
    .progress-container {
        background: darken($thing-background, 3%);
        border: var(--bar-border-width, 1px) solid var(--bar-border-color, var(--border-color));
        display: block;
        margin-top: var(--progress-margin-top, 0);
        overflow: hidden;
        padding: 2px;
        position: relative;
        width: 100%;
    }
    .progress-bar {
        height: var(--bar-height, 2rem);
        background:
            linear-gradient(
                    -45deg,
                    rgba(255, 255, 255, 0.05) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0.05) 75%,
                    transparent 75%
                )
                left/30px 30px repeat,
            linear-gradient(
                to right,
                rgba(160, 0, 0, 0.7) 0%,
                rgba(160, 160, 0, 0.7) 50%,
                rgba(0, 160, 0, 0.7) 100%
            );
        width: 100%;
    }
    .progress-bar-hider {
        background: darken($thing-background, 3%);
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: calc(100% - var(--width, 0%));
    }
    .text-container {
        display: flex;
        justify-content: space-between;
        left: 0;
        padding: 0 0.6rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
    }
    span {
        --image-margin-top: -4px;

        margin: 0;
        white-space: nowrap;

        &.right {
            word-spacing: -0.2ch;
        }
        &.short {
            font-size: 0.95rem;
            text-align: center;
            width: 100%;
            word-spacing: -0.2ch;
        }
    }
</style>

<button class="progress-container {cls}" on:click on:keypress>
    <div class="progress-bar"></div>
    <div class="progress-bar-hider" style="--width: {(have / total) * 100}%"></div>
    <div class="text-container">
        <span class="drop-shadow {textCls || ''}">
            {#if title}
                {#if selected}
                    <IconifyIcon icon={iconStrings['arrow-right']} />
                {/if}
                {title}
            {/if}
        </span>

        <span class="drop-shadow">
            {#if midText}
                {midText}
            {/if}
        </span>

        <span class="drop-shadow" class:short={shortText} class:right={!shortText}>
            {#if total > 0}
                {#if shortText}
                    {toNiceNumber(have)} / {toNiceNumber(total)}
                {:else}
                    {have.toLocaleString()} / {total.toLocaleString()}
                {/if}
            {/if}
        </span>
    </div>
</button>
