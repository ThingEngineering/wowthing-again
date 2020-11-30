<script lang="ts">
    import active from 'svelte-spa-router/active'
</script>

<style lang="scss">
    @import "../../scss/variables.scss";
    nav {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;
        margin-right: 2rem;
        padding: 0.5rem 0;
        min-width: 9rem;
        width: 9rem;
    }
    ul {
        margin: 0;
    }
    li {
        padding: 0.2rem 0.5rem;
    }
    .spacer {
        height: 1rem;
    }
</style>

<nav>
    <ul>
        <li use:active={'/'}>
            <a href="#/">Home (Table)</a>
        </li>
        <li use:active={'/cards'}>
            <a href="#/cards">Home (Cards)</a>
        </li>
        <li use:active={'/reputations/*'}>
            <a href="#/reputations/shadowlands">Reputations</a>
        </li>
        <li class="spacer"></li>
        <li use:active={'/mounts'}>
            <a href="#/mounts">Mounts</a>
        </li>
        <li use:active={'/pets'}>
            <a href="#/pets">Pets [NYI]</a>
        </li>
        <li use:active={'/toys'}>
            <a href="#/toys">Toys [NYI]</a>
        </li>
        <li class="spacer"></li>
        <li use:active={'/settings'}>
            <a href="#/settings">Settings</a>
        </li>
    </ul>
</nav>
