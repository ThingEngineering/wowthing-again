<script lang="ts">
    import Items from './Items.svelte'
    import Sidebar from './Sidebar.svelte'

    export let seasonSlug: string
    export let classSlug: string
</script>

<div class="view">
    <Sidebar />

    {#if seasonSlug && classSlug}
        <Items {seasonSlug} {classSlug} />
    {/if}
</div>
