<script lang="ts">
    import {getContext} from 'svelte'
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import {data as userData} from '../../stores/user-store'
    import CollectionCount from './CollectionCount.svelte'
    import SubSidebar from '../common/SubSidebar.svelte'

    const {route, sets} = getContext('collection')
</script>

<style lang="scss">
    @import "scss/variables.scss";

    li {
        position: relative;
    }
    .separator {
        border-top: 1px solid $border-color;
        margin-top: 0.5rem;
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
</style>

<SubSidebar>
    {#each sets as categories}
        {#if categories}
            <li use:active={`/${route}/${categories[0].Slug}`}>
                <a href="/{ route }/{ categories[0].Slug }" use:link>{ categories[0].Name }</a>
                <span>
                    <CollectionCount counts={$userData.setCounts[route][categories[0].Slug]} />
                </span>
            </li>
        {:else}
            <li class="separator"></li>
        {/if}
    {/each}
</SubSidebar>
