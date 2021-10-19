<script lang="ts">
    import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
    import { onMount } from 'svelte'
    import Fa from 'svelte-fa'
    import { link, location, replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import type {SidebarItem} from '@/types'
    import getPercentClass from '@/utils/get-percent-class'

    export let anyChildren: boolean
    export let baseUrl: string
    export let item: SidebarItem
    export let noVisitRoot = false
    export let parentItem: SidebarItem = undefined
    export let percentFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => number = undefined

    let expanded: boolean
    let percent = -1
    let url: string

    $: {
        if (item) {
            url = `${baseUrl}/${item.slug}`
            expanded = $location.startsWith(url) && item.children?.length > 0

            if (percentFunc !== undefined) {
                percent = percentFunc(item, parentItem)
            }

            if (noVisitRoot && expanded && $location === url ) {
                replace(`${url}/${item.children[0].slug}`)
            }
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

        ul li a {
            padding-left: 1.5rem;
        }

        & :global(svg) {
            margin-top: 0.35rem;
        }
    }

    a {
        color: var(--linkColor, $link-color);
        display: block;
        padding: 0.15rem 0.5rem;

        &:global(.active) {
            background: $active-background;
        }

        &:hover {
            background: $highlight-background;
        }
    }

    .percent {
        position: absolute;
        right: 0.5rem;
        word-spacing: -0.2ch;
    }
    .percent-children {
        right: 1.8rem;
    }
</style>

{#if item}
    <li>
        <a
            href="{url}"
            style="{noVisitRoot ? '--linkColor: #ffffff' : null}"
            use:link
            use:active={new RegExp('^' + url.replace(/\//g, '\\/') + '(?:\\?.*?)?$')}
        >
            {item.name}

            {#if percent >= 0}
                <span class="drop-shadow percent {anyChildren ? 'percent-children' : ''} {getPercentClass(percent)}">{Math.floor(percent).toFixed(0)} %</span>
            {/if}

            {#if item.children?.length > 0}
                <Fa fw icon={expanded ? faChevronDown : faChevronRight} pull="right" size="sm" />
            {/if}
        </a>

        {#if expanded}
            <ul>
                {#each item.children as child}
                    <svelte:self
                        {anyChildren}
                        baseUrl={url}
                        item={child}
                        parentItem={item}
                        {percentFunc}
                    />
                {/each}
            </ul>
        {/if}
    </li>
{:else}
    <li class="separator"></li>
{/if}
