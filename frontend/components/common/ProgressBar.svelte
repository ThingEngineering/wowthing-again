<script lang="ts">
    export let title: string
    export let have = Math.floor(Math.random() * 100)
    export let total = 100
</script>

<style lang="scss">
    .progress-container {
        background: darken($thing-background, 3%);
        border: 1px solid $border-color;
        border-radius: 1rem;
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
        @include text-shadow();

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

<div class="progress-container">
    <div class="progress-bar"></div>
    <div class="progress-bar-hider" style="--width: {have / total * 100}%"></div>
    <span class="left">{title}</span>
    <span class="right">{have.toLocaleString()} / {total.toLocaleString()}</span>
</div>
