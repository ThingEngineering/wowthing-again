<script lang="ts">
    import { link, location, replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { iconStrings } from '@/data/icons'
    import { subSidebarState } from '@/stores/local-storage'
    import getPercentClass from '@/utils/get-percent-class'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { SidebarItem } from './types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import Tooltip from '@/shared/components/parsed-text/Tooltip.svelte'

    export let alwaysExpand: boolean
    export let anyChildren: boolean
    export let baseUrl: string
    export let item: SidebarItem
    export let noVisitRoot = false
    export let parentItems: SidebarItem[] = []
    export let dataFunc: (entry: SidebarItem) => string = undefined
    export let decorationFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => string = undefined
    export let percentFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => number = undefined

    let activeRegex: string
    let data: string
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
        if (parentItems) {
            temp += (parentItems.length * 1) // TODO this should be 1.5 but that doesn't work properly, why?
        }
        minusWidth = temp > 0 ? `${temp}rem` : '0px'
    }

    let actualNoVisitRoot: boolean
    let noCollapse: boolean
    $: {
        actualNoVisitRoot = (noVisitRoot && item?.children?.length > 0) || item?.forceNoVisit
        if (item) {
            url = item.fullUrl || `${baseUrl}/${item.slug}`

            expanded = alwaysExpand ||
                $subSidebarState.expanded[url] ||
                ($location.startsWith(url) && !($location === url) && item.children?.length > 0)

            //expanded = $location.startsWith(url) && item.children?.length > 0

            data = dataFunc?.(item)
            decoration = decorationFunc?.(item, parentItems)
            percent = percentFunc?.(item, parentItems)

            if (actualNoVisitRoot && expanded && $location.startsWith(url) && $location !== url) {
                noCollapse = true
            }
            else if (alwaysExpand) {
                noCollapse = true
            }
            else {
                noCollapse = false
            }

            if (actualNoVisitRoot && $location === url ) {
                $subSidebarState.expanded[url] = true
                replace(`${url}/${item.children[0].slug}`)
            }

            if (parentItems.length > 0 || item.forceWildcard === true) {
                if (item.children) {
                    activeRegex = '^' + url.replace(/\//g, '\\/') + '\\/?$';
                } else {
                    activeRegex = '^' + url.replace(/\//g, '\\/') + '(?:\\/|$)'
                }
            }
            else {
                activeRegex = '^' + url.replace(/\//g, '\\/') + '(?:\\?.*?)?$'
            }
        }
    }

    const toggleExpanded = () => {
        expanded = !expanded
        $subSidebarState.expanded[url] = expanded

        if ($location.startsWith(url) && $location !== url) {
            replace(url)
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
            --link-color: #eee;

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
        --link-color: #64ffd1;

        > :global(a) {
            padding-left: calc(1.0rem * var(--subtree-depth, 1));
        }
        :global(.separator) {
            margin: 0.2rem 1.7rem 0.2rem 1rem;
        }

        :global(.noVisitRoot) {
            --link-color: #ccffd1;
        }
    }
    .separator {
        border-top: 1px solid $border-color;
        margin: 0.2rem 0;
    }
    .expand {
        position: absolute;
        right: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
    }
    .expand-no {
        opacity: $inactive-opacity;
    }
    .expand-clickable {
        cursor: crosshair;
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
    .noVisitRoot {
        --link-color: #ffffff;
    }
</style>

{#if item}
    {#key url}
        <a
            href="{url}"
            style="--minusWidth: {minusWidth}"
            style:--subtree-depth="{parentItems.length}"
            class:noVisitRoot={actualNoVisitRoot}
            data-info={data}
            use:link
            use:active={new RegExp(activeRegex)}
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    content: item.name,
                },
            }}
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
                <button
                    class="expand"
                    class:expand-clickable={!noCollapse}
                    class:expand-no={noCollapse}
                    on:click|preventDefault|stopPropagation={noCollapse ? null : toggleExpanded}
                >
                    <IconifyIcon
                        icon={iconStrings['chevron-' + (expanded ? 'down' : 'right')]}
                    />
                </button>
            {/if}
        </a>

        {#if expanded && item.children}
            <div class="subtree">
                {#each item.children as child}
                    <svelte:self
                        baseUrl={url}
                        item={child}
                        parentItems={[...parentItems, item]}
                        {alwaysExpand}
                        {anyChildren}
                        {noVisitRoot}
                        {dataFunc}
                        {decorationFunc}
                        {percentFunc}
                    />
                {/each}
            </div>
        {/if}
    {/key}
{:else}
    <div class="separator"></div>
{/if}
