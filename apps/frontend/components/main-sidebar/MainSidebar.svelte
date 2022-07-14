<script lang="ts">
    export let id = ''
    export let width = '10rem'
</script>

<style lang="scss">
    nav {
        border: 1px solid $border-color;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0;
        margin-left: -1rem;
        margin-right: 1rem;
        min-width: var(--width);
        padding: 0.2rem 0;
        position: sticky;
        top: 0;
        width: var(--width);
    }
    ul {
        margin: 0;
    }
    ul :global(li a) {
        display: block;
        padding: 0.15rem 0.5rem;
    }
    ul :global(.active) {
        background: $active-background;
    }
    ul :global(.separator) {
        border-top: 1px solid $border-color;
        margin: 0.2rem 0;
    }
</style>

<nav id="{id}" class="thing-container" style="--width: {width}">
    <ul>
        <slot />
    </ul>
</nav>
