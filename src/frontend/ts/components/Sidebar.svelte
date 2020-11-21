<script lang="ts">
</script>

<style lang="scss">
    @import "../../scss/variables.scss";
    nav {
        background: $thing-background;
        border: 1px solid $border-color;
        margin-right: 2rem;
        padding: 0.5rem 0;
        min-width: 9rem;
        width: 9rem;
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
            <a href="#/">Home (Table)</a>
        </li>
        <li>
            <a href="#/cards">Home (Cards)</a>
        </li>
        <li class="spacer"></li>
        <li>
            <a href="#/settings">Settings</a>
        </li>
    </ul>
</nav>
