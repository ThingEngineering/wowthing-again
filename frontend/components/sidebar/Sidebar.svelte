<script lang="ts">
    import some from 'lodash/some'

    import type {SidebarItem} from '@/types'

    import SidebarEntry from './SidebarEntry.svelte'

    export let baseUrl: string
    export let items: SidebarItem[]
    export let id = ''
    export let percentFunc: (entry: SidebarItem) => number = undefined
    export let width = '10rem'

    let anyChildren = false
    $: {
        anyChildren = some(items, (item) => (item?.children?.length ?? 0) > 0)
        console.log(items, anyChildren)
    }
</script>

<style lang="scss">
    nav {
        --linkColor: #64e1ff;

        border: 1px solid $border-color;
        margin-right: 1rem;
        min-width: var(--width);
        padding: 0.5rem 0;
        position: sticky;
        top: 0;
        width: var(--width);

        ul {
            margin: 0;
        }
    }
</style>

<nav id="{id}" class="thing-container" style="--width: {width}">
    <ul>
        {#each items as item}
            <SidebarEntry {anyChildren} {baseUrl} {item} {percentFunc} />
        {/each}
    </ul>
</nav>
