<script lang="ts">
    import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'
    import { link, location } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import type {SidebarItem} from '@/types'

    export let baseUrl: string
    export let item: SidebarItem

    let expanded: boolean
    let url: string

    $: {
        if (item) {
            url = `${baseUrl}/${item.slug}`
            expanded = $location.startsWith(url)
        }
    }
</script>

<style lang="scss">
    li {
        color: #00ccff;

        &.separator {
            border-top: 1px solid $border-color;
            margin: 0.5rem 0;
        }

        ul {
            margin-left: 1rem;
        }

        & :global(svg) {
            margin-top: 0.35rem;
        }
    }

    a {
        color: var(--linkColor, $link-color);
        display: block;
        padding: 0.2rem 0.5rem;

        &:global(.active) {
            background: $active-background;
        }
    }
</style>

{#if item}
    <li>
        <a href="{url}" use:active use:link>
            {item.name}
            {#if item.children.length > 0}
                <Fa fw icon={expanded ? faChevronDown : faChevronRight} pull="right" size="sm" />
            {/if}
        </a>
        {#if item.children.length > 0}
            {#if expanded}
                <ul>
                    {#each item.children as child}
                        <svelte:self baseUrl={url} item={child} />
                    {/each}
                </ul>
            {/if}
        {/if}
    </li>
{:else}
    <li class="separator"></li>
{/if}
