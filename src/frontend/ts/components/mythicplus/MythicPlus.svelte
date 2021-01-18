<script lang="ts">
    import MythicPlusSidebar from './MythicPlusSidebar.svelte'
    import MythicPlusTable from './MythicPlusTable.svelte'

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
