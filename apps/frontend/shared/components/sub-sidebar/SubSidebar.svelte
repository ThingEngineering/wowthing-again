<script lang="ts" generics="TItem extends SidebarItem">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { measureScrollbar } from '@/utils/measure-scrollbar';
    import type { SidebarItem } from './types';

    import SidebarEntry from './SubSidebarEntry.svelte';

    type Props = {
        baseUrl: string;
        items: TItem[];
        alwaysExpand?: boolean;
        id?: string;
        noVisitRoot?: boolean;
        scrollable?: boolean;
        width?: string;
        dataFunc?: (entry: TItem) => string;
        decorationFunc?: (entry: TItem, parentEntries?: TItem[]) => string;
        percentFunc?: (entry: TItem, parentEntries?: TItem[]) => number;
    };

    let {
        baseUrl,
        items,
        alwaysExpand = false,
        id = 'sub-sidebar',
        noVisitRoot = false,
        scrollable = false,
        width = '10rem',
        dataFunc = undefined,
        decorationFunc = undefined,
        percentFunc = undefined,
    }: Props = $props();

    let anyChildren = $derived(items.some((item) => (item?.children?.length ?? 0) > 0));
    let lessHeight = $derived(settingsState.value.layout.newNavigation ? '7rem' : '4.4rem');

    const scrollbarWidth = measureScrollbar();
</script>

<style lang="scss">
    div {
        --image-border-width: 1px;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-right: 1rem;
        min-width: var(--width);
        position: sticky;
        top: var(--sticky-top, 0);
        width: var(--width);

        &.scrollable {
            max-height: calc(100vh - var(--less-height));
            min-width: calc(var(--width) + var(--scrollbar-width));
            overflow-y: auto;
            scrollbar-gutter: stable;
            width: calc(var(--width) + var(--scrollbar-width));
        }
        &.sticky {
            min-width: var(--width);
            width: var(--width);
        }
    }

    nav {
        --color-link: #64e1ff;

        border: 1px solid var(--border-color);
        padding: 0.2rem 0;
        width: 100%;
    }
</style>

<div
    class:scrollable
    class:sticky={!scrollable}
    style="--less-height: {lessHeight}; --width: {width}; --scrollbar-width: {scrollbarWidth}px"
>
    <slot name="before" />

    <nav {id} class="thing-container">
        {#each items as item}
            <SidebarEntry
                {alwaysExpand}
                {anyChildren}
                {baseUrl}
                {item}
                {noVisitRoot}
                {dataFunc}
                {decorationFunc}
                {percentFunc}
            />
        {/each}
    </nav>

    <slot name="after" />
</div>
