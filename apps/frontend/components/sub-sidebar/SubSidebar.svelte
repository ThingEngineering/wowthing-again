<script lang="ts">
    import some from 'lodash/some'

    import type { SidebarItem } from '@/types'

    import SidebarEntry from './SubSidebarEntry.svelte'
    import { settingsStore } from '@/stores';

    export let alwaysExpand = false
    export let baseUrl: string
    export let items: SidebarItem[]
    export let id = 'sub-sidebar'
    export let noVisitRoot = false
    export let scrollable = false
    export let width = '10rem'
    export let decorationFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => string = undefined
    export let percentFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => number = undefined

    $: anyChildren = some(items, (item) => (item?.children?.length ?? 0) > 0)
    $: lessHeight = $settingsStore.layout.newNavigation ? '8rem' : '4.4rem'
</script>

<style lang="scss">
    div {
        margin-right: 1rem;
        position: sticky;
        top: 0;

        &.scrollable {
            max-height: calc(100vh - var(--less-height));
            min-width: calc(var(--width) + 1rem);
            overflow-y: scroll;
            width: calc(var(--width) + 1rem);
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
    style="--less-height: {lessHeight}; --width: {width}">
    <slot name="before" />

    <nav id="{id}" class="thing-container">
        {#each items as item}
            <SidebarEntry
                {alwaysExpand}
                {anyChildren}
                {baseUrl}
                {item}
                {noVisitRoot}
                {decorationFunc}
                {percentFunc}
            />
        {/each}
    </nav>

    <slot name="after" />
</div>
