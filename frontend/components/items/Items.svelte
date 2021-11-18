<script lang="ts">
    import Search from './ItemsSearch.svelte'
    import Sidebar from './ItemsSidebar.svelte'

    export let params: { slug: string }
</script>

<Sidebar />
{#if params.slug === 'search'}
    <Search />
{/if}
