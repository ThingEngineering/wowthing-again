<script lang="ts">
    import { iconStrings } from '@/data/icons'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import { toNiceNumber } from '@/utils/formatting'

    export let cls: string = null
    export let title: string = null
    export let have = Math.floor(Math.random() * 100)
    export let selected = false
    export let shortText = false
    export let textCls: string = null
    export let total = 100
</script>

<style lang="scss">
    .progress-container {
        background: darken($thing-background, 3%);
        border: var(--bar-border-width, 1px) solid $border-color;
        margin-top: var(--progress-margin-top, 0);
        overflow: hidden;
        position: relative;
        width: 100%;
    }
    .progress-bar {
        height: var(--bar-height, 2rem);
        background:
            linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.05) 25%, transparent 25%,
                transparent 50%, rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.05) 75%, transparent 75%
            ) left/30px 30px repeat,
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
    span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        white-space: nowrap;

        &.left {
            left: 0.8rem;
        }
        &.right {
            right: 0.8rem;
            word-spacing: -0.1ch;
        }
        &.short {
            font-size: 0.95rem;
            left: 0;
            text-align: center;
            width: 100%;
            word-spacing: -0.1ch;
        }
    }
</style>

<button
    class="progress-container {cls}"
    on:click
    on:keypress
>
    <div class="progress-bar"></div>
    <div class="progress-bar-hider" style="--width: {have / total * 100}%"></div>
    {#if title}
        <span class="left drop-shadow {textCls || ''}">
            {#if selected}
                <IconifyIcon icon={iconStrings['arrow-right']} />
            {/if}
            {title}
        </span>
    {/if}
    {#if total > 0}
        <span
            class="drop-shadow"
            class:short={shortText}
            class:right={!shortText}
        >
            {#if shortText}
                {toNiceNumber(have)} / {toNiceNumber(total)}
            {:else}
                {have.toLocaleString()} / {total.toLocaleString()}
            {/if}
        </span>
    {/if}
</button>
