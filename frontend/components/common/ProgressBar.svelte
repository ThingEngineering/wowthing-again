<script lang="ts">
    export let title: string
    export let have = Math.floor(Math.random() * 100)
    export let need = 100
</script>

<style lang="scss">
    .progress-container {
        background: darken($thing-background, 3%);
        border: 1px solid $border-color;
        border-radius: 1rem;
        margin-top: 1rem;
        overflow: hidden;
        position: relative;
        width: 100%;
    }
    .progress-bar {
        height: 2rem;
        background:
            linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.1) 25%, transparent 25%,
                transparent 50%, rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0.1) 75%, transparent 75%
            ) left/30px 30px repeat-x,
            linear-gradient(
                to right,
                #880000 0%,
                #880000 10%,
                #888800 50%,
                #008800 90%,
                #008800 100%
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
        }
    }
</style>

<div class="progress-container">
    <div class="progress-bar"></div>
    <div class="progress-bar-hider" style="--width: {have / need * 100}%"></div>
    <span class="left">{title}</span>
    <span class="right">{have} / {need}</span>
</div>
