<script lang="ts">
    import {getContext} from 'svelte'
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import type {CollectionContext} from '@/types/contexts'

    import {data as userData} from '@/stores/user-store'
    import CollectionCount from './CollectionCount.svelte'
    import Sidebar from '@/components/common/Sidebar.svelte'

    const { route, sets } = getContext('collection') as CollectionContext
</script>

<style lang="scss">
    @import 'scss/variables';

    li {
        position: relative;
    }
    a {
        display: block;
    }
    span {
        background: $sidebar-pill-background;
        border: 1px solid $border-color;
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
        color: #bbb;
        float: right;
        font-size: #{$sidebar-pill-scale}rem;
        line-height: calc(1.5 / #{$sidebar-pill-scale});
        padding: 0 0.3rem 0.1rem;
        pointer-events: none;
        position: absolute;
        right: -1px;
        top: 50%;
        transform: translateY(-50%);
        word-spacing: -0.2ch;
    }
</style>

<Sidebar width="14rem">
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
</Sidebar>
