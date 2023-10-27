<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import Items from './Items.svelte'
    import Sidebar from './Sidebar.svelte'

    export let seasonSlug: string
    export let classSlug: string

    afterUpdate(() => getSavedRoute('items/convertible', seasonSlug, classSlug))
</script>

<div class="view">
    <Sidebar />

    {#if seasonSlug && classSlug}
        <Items {seasonSlug} {classSlug} />
    {/if}
</div>
