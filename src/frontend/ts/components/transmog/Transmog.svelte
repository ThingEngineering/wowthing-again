<script lang="ts">
    import {data as staticData} from '../../stores/static-store'

    import TransmogSidebar from './Sidebar.svelte'

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
    <TransmogSidebar />
</div>
