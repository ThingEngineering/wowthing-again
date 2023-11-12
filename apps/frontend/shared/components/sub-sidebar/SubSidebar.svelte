<script lang="ts">
    import some from 'lodash/some'

    import { settingsStore } from '@/user-home/stores/settings/store'
    import { measureScrollbar } from '@/utils/measure-scrollbar'
    import type { SidebarItem } from './types'

    import SidebarEntry from './SubSidebarEntry.svelte'

    export let alwaysExpand = false
    export let baseUrl: string
    export let items: SidebarItem[]
    export let id = 'sub-sidebar'
    export let noVisitRoot = false
    export let scrollable = false
    export let width = '10rem'
    export let dataFunc: (entry: SidebarItem) => string = undefined
    export let decorationFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => string = undefined
    export let percentFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => number = undefined

    $: anyChildren = some(items, (item) => (item?.children?.length ?? 0) > 0)
    $: lessHeight = $settingsStore?.layout?.newNavigation ? '7rem' : '4.4rem'

    const scrollbarWidth = measureScrollbar()
</script>

<style lang="scss">
    div {
        --image-border-width: 1px;

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
        --link-color: #64e1ff;

        border: 1px solid $border-color;
        padding: 0.2rem 0;
        width: 100%;
    }
</style>

<div
    class:scrollable={scrollable}
    class:sticky={!scrollable}
    style="--less-height: {lessHeight}; --width: {width}; --scrollbar-width: {scrollbarWidth}px"
>
    <slot name="before" />

    <nav id="{id}" class="thing-container">
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
