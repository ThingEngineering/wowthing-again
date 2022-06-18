<script lang="ts">
    import { link, location, replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { iconStrings } from '@/data/icons'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type {SidebarItem} from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

    export let anyChildren: boolean
    export let baseUrl: string
    export let item: SidebarItem
    export let noVisitRoot = false
    export let parentItem: SidebarItem = undefined
    export let decorationFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => string = undefined
    export let percentFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => number = undefined

    let activeRegex: string
    let decoration: string
    let expanded: boolean
    let minusWidth: string
    let percent = -1
    let url: string

    $: {
        let temp = 0.5
        if (decorationFunc || percentFunc) {
            temp += 3.3
        }
        if (anyChildren) {
            temp += 1.3
        }
        if (parentItem) {
            temp += 1 // TODO this should be 1.5 but that doesn't work properly, why?
        }
        minusWidth = temp > 0 ? `${temp}rem` : '0px'
    }

    $: {
        if (item) {
            url = `${baseUrl}/${item.slug}`
            expanded = $location.startsWith(url) && item.children?.length > 0

            if (decorationFunc !== undefined) {
                decoration = decorationFunc(item, parentItem)
            }
            if (percentFunc !== undefined) {
                percent = percentFunc(item, parentItem)
            }

            if (noVisitRoot && expanded && $location === url ) {
                replace(`${url}/${item.children[0].slug}`)
            }

            if (parentItem || item.forceWildcard === true) {
                activeRegex = '^' + url.replace(/\//g, '\\/') + '(?:\\/|$)'
            }
            else {
                activeRegex = '^' + url.replace(/\//g, '\\/') + '(?:\\?.*?)?$'
            }
        }
    }
</script>

<style lang="scss">
    a {
        color: var(--link-color, $link-color);
        display: block;
        padding: 0.15rem 0.5rem;
        position: relative;

        &:global(.active) {
            background: $active-background;
        }
        &:hover {
            background: $highlight-background;
        }

        > :global(span:first-child) {
            display: block;
            width: calc(var(--width) - var(--minusWidth));
        }
    }
    .subtree {
        padding-left: 1.0rem;
    }
    .separator {
        border-top: 1px solid $border-color;
        margin: 0.5rem 0;
    }
    .expand {
        position: absolute;
        right: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .decoration {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        word-spacing: -0.2ch;
    }
    .decoration-children {
        right: 1.8rem;
    }
</style>

{#if item}
    <a
        href="{url}"
        style="--minusWidth: {minusWidth};{noVisitRoot ? '--link-color: #ffffff' : ''}"
        use:link
        use:active={new RegExp(activeRegex)}
        use:tippy={item.name}
    >
        <ParsedText
            cls="text-overflow"
            text={item.name}
        />

        {#if decoration !== undefined}
            <span
                class="drop-shadow decoration"
                class:decoration-children={anyChildren}
                class:quality2={(item.children?.length ?? 0) === 0}
                class:quality3={item.children?.length > 0}
            >{decoration}</span>
        {:else if percent >= 0}
            <span
                class="drop-shadow decoration {getPercentClass(percent)}"
                class:decoration-children={anyChildren}
            >{Math.floor(percent).toFixed(0)} %</span>
        {/if}

        {#if item.children?.length > 0}
            <span class="expand">
                <IconifyIcon
                    icon={iconStrings['chevron-' + (expanded ? 'down' : 'right')]}
                />
            </span>
        {/if}
    </a>

    {#if expanded}
        <div class="subtree">
            {#each item.children as child}
                <svelte:self
                    {anyChildren}
                    baseUrl={url}
                    item={child}
                    parentItem={item}
                    {decorationFunc}
                    {percentFunc}
                />
            {/each}
        </div>
    {/if}
{:else}
    <div class="separator"></div>
{/if}
