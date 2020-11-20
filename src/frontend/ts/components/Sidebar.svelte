<script lang="ts">
</script>

<style lang="scss">
    @import "../../scss/variables.scss";
    nav {
        background: $thing-background;
        border: 1px solid $border-color;
        margin-right: 2rem;
        padding: 0.5rem 0;
        min-width: 8em;
        width: 8rem;
    }
    ul {
        margin: 0;
    }
    li {
        padding: 0.2rem 1rem;
    }
    .spacer {
      height: 1rem;
    }
</style>

<nav>
    <ul>
        <li>
            <a href="#/">Home</a>
        </li>
        <li>
            <a href="#/">Also Home</a>
        </li>
        <li class="spacer"></li>
        <li>
            <a href="#/settings">Settings</a>
        </li>
    </ul>
</nav>
