<script lang="ts">
    import {data as staticData} from '../../stores/static-store'

    import ReputationSidebar from './ReputationSidebar.svelte'
    import ReputationTable from './ReputationTable.svelte'

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
    <ReputationSidebar />
    <ReputationTable slug={params.slug} />
</div>
