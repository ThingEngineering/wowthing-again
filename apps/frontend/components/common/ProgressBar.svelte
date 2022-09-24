<script lang="ts">
    import { iconStrings } from '@/data/icons'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let cls: string = null
    export let title: string
    export let have = Math.floor(Math.random() * 100)
    export let selected = false
    export let textCls: string = null
    export let total = 100
</script>

<style lang="scss">
    .progress-container {
        background: darken($thing-background, 3%);
        border: var(--bar-border-width, 1px) solid $border-color;
        border-radius: $border-radius;
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

        &.left {
            left: 0.8rem;
        }
        &.right {
            right: 0.8rem;
            word-spacing: -0.1ch;
        }
    }
</style>

<div
    class="progress-container {cls}"
    on:click
>
    <div class="progress-bar"></div>
    <div class="progress-bar-hider" style="--width: {have / total * 100}%"></div>
    <span class="left drop-shadow {textCls}">
        {#if selected}
            <IconifyIcon icon={iconStrings['arrow-right']} />
        {/if}
        {title}
    </span>
    {#if total > 0}
        <span class="right drop-shadow">
            {have.toLocaleString()} / {total.toLocaleString()}
        </span>
    {/if}
</div>
