<script lang="ts">
    import some from 'lodash/some'

    import type { SidebarItem } from '@/types'

    import SidebarEntry from './SubSidebarEntry.svelte'

    export let baseUrl: string
    export let items: SidebarItem[]
    export let id = 'sub-sidebar'
    export let noVisitRoot = false
    export let width = '10rem'
    export let decorationFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => string = undefined
    export let percentFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => number = undefined

    let anyChildren: boolean
    $: {
        anyChildren = some(items, (item) => (item?.children?.length ?? 0) > 0)
    }
</script>

<style lang="scss">
    div {
        margin-right: 1rem;
        min-width: var(--width);
        position: sticky;
        top: 0;
        width: var(--width);
    }

    nav {
        --link-color: #64e1ff;

        border: 1px solid $border-color;
        padding: 0.2rem 0;
        width: 100%;
    }
</style>

<div style="--width: {width}">
    <slot name="before" />

    <nav id="{id}" class="thing-container">
        {#each items as item}
            <SidebarEntry
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
