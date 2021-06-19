<script lang="ts">
    export let width = '10rem'
</script>

<style lang="scss">
    nav {
        border: 1px solid $border-color;
        margin-right: 1rem;
        min-width: var(--width);
        padding: 0.5rem 0;
        position: sticky;
        top: 0;
        width: var(--width);
    }
    ul {
        margin: 0;
    }
    ul :global(li) {
        padding: 0.2rem 0.5rem;
    }
    ul :global(.active) {
        background: $active-background;
    }
    ul :global(.separator) {
        border-top: 1px solid $border-color;
        margin-top: 0.5rem;
    }
</style>

<nav class="thing-container" style="--width: {width}">
    <ul>
        <slot />
    </ul>
</nav>
