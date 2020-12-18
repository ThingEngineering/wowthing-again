<script lang="ts">
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    :global(li.active) {
        background: $active-background;
    }

    nav {
        margin-right: 1rem;
        min-width: 14rem;
        padding: 0.5rem 0;
        position: sticky;
        top: 0;
        width: 14rem;
    }
    ul {
        margin: 0;
    }
    ul :global(li) {
        padding: 0.2rem 0.5rem;
    }
</style>

<nav id="sub-sidebar" class="thing-container">
    <ul>
        <slot></slot>
    </ul>
</nav>
