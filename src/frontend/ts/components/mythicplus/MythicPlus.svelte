<script lang="ts">
    import MythicPlusSidebar from './Sidebar.svelte'
    import MythicPlusTable from './Table.svelte'

    export let params: { slug }
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <MythicPlusSidebar />
    <MythicPlusTable slug={params.slug} />
</div>
