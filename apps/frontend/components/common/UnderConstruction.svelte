<style lang="scss">
    .under-construction {
        background: mix($thing-background, $colour-fail, 90%);
        font-weight: 600;
        margin-bottom: 1rem;
        padding: 0.75rem;
    }
</style>

<div class="under-construction thing-container border">
    <slot>
        This area is under construction and probably doesn't work very well, please be patient!
    </slot>
</div>
