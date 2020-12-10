<script lang="ts">
    import {getContext} from 'svelte'
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import {data as userData} from '../../stores/user-store'
    import SubSidebar from '../common/SubSidebar.svelte'

    const {route, sets} = getContext("collection")
</script>

<style lang="scss">
    @import "scss/variables.scss";

    li {
        position: relative;
    }
    a {
        display: block;
    }
    span {
        background: $sidebar-pill-background;
        border: 1px solid $border-color;
        border-radius: 0.3rem;
        float: right;
        font-size: #{$sidebar-pill-scale}rem;
        line-height: calc(1.5 / #{$sidebar-pill-scale});
        padding: 0 0.3rem 0.1rem;
        pointer-events: none;
        position: absolute;
        right: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
        word-spacing: -0.2ch;
    }
    em {
        color: mix($body-text, #00ff00, 80%);
    }
</style>

<SubSidebar>
    {#each sets.map(categories => ({category: categories[0], counts: $userData.setCounts[route][categories[0].Slug]})) as { category, counts }}
        <li use:active={`/${route}/${category.Slug}`}>
            <a href="/{ route }/{ category.Slug }" use:link>{ category.Name }</a>
            <span><em>{ counts.have }</em> / <em>{ counts.total }</em></span>
        </li>
    {/each}
</SubSidebar>
