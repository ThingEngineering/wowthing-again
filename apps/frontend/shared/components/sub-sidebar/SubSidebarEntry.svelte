<script lang="ts" generics="TItem extends SidebarItem">
    import { link, location, replace } from 'svelte-spa-router';
    import active from 'svelte-spa-router/active';

    import { iconStrings } from '@/data/icons';
    import { subSidebarState } from '@/stores/local-storage';
    import getPercentClass from '@/utils/get-percent-class';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { SidebarItem } from './types';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Tooltip from '@/shared/components/parsed-text/Tooltip.svelte';

    type Props = {
        alwaysExpand: boolean;
        anyChildren: boolean;
        baseUrl: string;
        item: TItem;
        noVisitRoot?: boolean;
        parentItems?: TItem[];
        dataFunc?: (entry: TItem) => string;
        decorationFunc?: (entry: TItem, parentEntries?: TItem[]) => string;
        percentFunc?: (entry: TItem, parentEntries?: TItem[]) => number;
    };

    let {
        alwaysExpand,
        anyChildren,
        baseUrl,
        item,
        noVisitRoot = false,
        parentItems = [],
        dataFunc = undefined,
        decorationFunc = undefined,
        percentFunc = undefined,
    }: Props = $props();

    // export let alwaysExpand: boolean;
    // export let anyChildren: boolean;
    // export let baseUrl: string;
    // export let item: TItem;
    // export let noVisitRoot = false;
    // export let parentItems: TItem[] = [];
    // export let dataFunc: (entry: TItem) => string = undefined;
    // export let decorationFunc: (entry: TItem, parentEntries?: TItem[]) => string = undefined;
    // export let percentFunc: (entry: TItem, parentEntries?: TItem[]) => number = undefined;

    let minusWidth = $derived.by(() => {
        let temp = 0.5;
        if (decorationFunc || percentFunc) {
            temp += 3.3;
        }
        if (anyChildren) {
            temp += 1.3;
        }
        if (parentItems) {
            temp += parentItems.length * 1; // TODO this should be 1.5 but that doesn't work properly, why?
        }
        return temp > 0 ? `${temp}rem` : '0px';
    });

    let actualNoVisitRoot = $derived(
        (noVisitRoot && item?.children?.length > 0) || item?.forceNoVisit
    );
    let url = $derived(item ? item.fullUrl || `${baseUrl}/${item.slug}` : undefined);
    let expanded = $derived(
        alwaysExpand ||
            $subSidebarState.expanded[url] ||
            ($location.startsWith(url) && !($location === url) && item.children?.length > 0)
    );

    let data = $derived(item ? dataFunc?.(item) : undefined);
    let decoration = $derived(item ? decorationFunc?.(item, parentItems) : undefined);
    let percent = $derived(item ? percentFunc?.(item, parentItems) || -1 : undefined);

    let noCollapse = $derived.by(() => {
        if (actualNoVisitRoot && expanded && $location.startsWith(url) && $location !== url) {
            return true;
        } else if (alwaysExpand) {
            return true;
        } else {
            return false;
        }
    });

    let activeRegex = $derived.by(() => {
        if (parentItems.length > 0 || item?.forceWildcard === true) {
            if (item?.children) {
                return '^' + url.replace(/\//g, '\\/') + '\\/?$';
            } else {
                return '^' + url.replace(/\//g, '\\/') + '(?:\\/|$)';
            }
        } else {
            return '^' + url.replace(/\//g, '\\/') + '(?:\\?.*?)?$';
        }
    });

    $effect(() => {
        if (item) {
            if (actualNoVisitRoot && $location === url) {
                $subSidebarState.expanded[url] = true;
                replace(`${url}/${item.children[0].slug}`);
            }
        }
    });

    const toggleExpanded = () => {
        expanded = !expanded;
        $subSidebarState.expanded[url] = expanded;

        if ($location.startsWith(url) && $location !== url) {
            replace(url);
        }
    };
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
            padding-left: calc(1rem * var(--subtree-depth, 1));
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
            href={url}
            style="--minusWidth: {minusWidth}"
            style:--subtree-depth={parentItems.length}
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
            <ParsedText cls="text-overflow" text={item.name} />

            {#if decoration !== undefined}
                <span
                    class="drop-shadow decoration"
                    class:decoration-children={anyChildren}
                    class:quality2={(item.children?.length ?? 0) === 0}
                    class:quality3={item.children?.length > 0}>{decoration}</span
                >
            {:else if percent >= 0}
                <span
                    class="drop-shadow decoration {getPercentClass(percent)}"
                    class:decoration-children={anyChildren}>{Math.floor(percent).toFixed(0)} %</span
                >
            {/if}

            {#if item.children?.length > 0}
                <button
                    class="expand"
                    class:expand-clickable={!noCollapse}
                    class:expand-no={noCollapse}
                    on:click|preventDefault|stopPropagation={noCollapse ? null : toggleExpanded}
                >
                    <IconifyIcon icon={iconStrings['chevron-' + (expanded ? 'down' : 'right')]} />
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
