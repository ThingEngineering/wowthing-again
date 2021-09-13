<script lang="ts">
    import { userQuestStore } from '@/stores'

    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: { slug: string }
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

{#await userQuestStore.fetch()}
    L O A D I N G
{:then _}
    <div>
        <ProgressSidebar />
        {#if params.slug}
            <ProgressTable slug={params.slug} />
        {/if}
    </div>
{/await}
