<script lang="ts">
    import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'
    import { link, location } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import type {SidebarItem} from '@/types'
    import getPercentClass from '@/utils/get-percent-class'

    export let baseUrl: string
    export let item: SidebarItem
    export let parentItem: SidebarItem = undefined
    export let percentFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => number = undefined
    let expanded: boolean
    let percent = -1
    let url: string

    $: {
        if (item) {
            url = `${baseUrl}/${item.slug}`
            expanded = $location.startsWith(url)

            if (percentFunc !== undefined) {
                percent = percentFunc(item, parentItem)
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
        padding: 0.2rem 0.5rem;

        &:global(.active) {
            background: $active-background;
        }
    }

    .percent {
        position: absolute;
        right: 1.8rem;
        word-spacing: -0.2ch;
    }
</style>

{#if item}
    <li>
        <a href="{url}" use:active use:link>
            {item.name}

            {#if percent >= 0}
                <span class="percent {getPercentClass(percent)}">{Math.floor(percent).toFixed(0)} %</span>
            {/if}

            {#if item.children?.length > 0}
                <Fa fw icon={expanded ? faChevronDown : faChevronRight} pull="right" size="sm" />
            {/if}
        </a>
        {#if item.children?.length > 0}
            {#if expanded}
                <ul>
                    {#each item.children as child}
                        <svelte:self baseUrl={url} item={child} parentItem={item} {percentFunc} />
                    {/each}
                </ul>
            {/if}
        {/if}
    </li>
{:else}
    <li class="separator"></li>
{/if}
