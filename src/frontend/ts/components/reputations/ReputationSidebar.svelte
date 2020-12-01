<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { data as staticData } from '../../stores/static-store'
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    :global(li.active) {
        background: $active-background;
    }

    nav {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;
        margin-right: 1rem;
        min-width: 11rem;
        padding: 0.5rem 0;
        position: sticky;
        top: 0;
        width: 11rem;
    }
    ul {
        margin: 0;
    }
    li {
        padding: 0.2rem 0.5rem;
    }
</style>

<nav>
    <ul>
        {#each $staticData.ReputationSets as reputation}
            <li use:active={'/reputations/' + reputation.Slug}>
                <a href="/reputations/{ reputation.Slug }" use:link>{ reputation.Name }</a>
            </li>
        {/each}
    </ul>
</nav>
