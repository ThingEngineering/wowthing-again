<script lang="ts">
    import type {SidebarItem} from '@/types'

    import SidebarEntry from './SidebarEntry.svelte'

    export let baseUrl: string
    export let items: SidebarItem[]
    export let id = ''
    export let linkColor = '';
    export let percentFunc: (entry: SidebarItem) => number = undefined
    export let width = '10rem'
</script>

<style lang="scss">
    nav {
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

<nav id="{id}" class="thing-container" style="--linkColor: {linkColor}; --width: {width}">
    <ul>
        {#each items as item}
            <SidebarEntry {baseUrl} {item} {percentFunc} />
        {/each}
    </ul>
</nav>
