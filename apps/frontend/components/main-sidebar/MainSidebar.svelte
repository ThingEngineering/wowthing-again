<script lang="ts">
    export let id = '';
    export let width = '10rem';
</script>

<style lang="scss">
    nav {
        margin-left: -1rem;
        margin-right: 1rem;
        min-width: var(--width);
        padding: 0.2rem 0;
        position: sticky;
        top: 0;
        width: var(--width);
    }
    ul {
        border: 1px solid var(--border-color);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0;
        margin: 0;
    }
    ul :global(li a) {
        display: block;
        padding: 0.15rem 0.5rem;
    }
    ul :global(.active) {
        --color-link: #eee;

        background: var(--color-active-background);
    }
    ul :global(.separator) {
        border-top: 1px solid var(--border-color);
        margin: 0.2rem 0;
    }
</style>

<div>
    <nav {id} style="--width: {width}">
        <ul class="thing-container">
            <slot />
        </ul>

        <slot name="after" />
    </nav>
</div>
