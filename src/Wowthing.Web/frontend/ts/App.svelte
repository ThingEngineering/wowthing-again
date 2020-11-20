<script lang="ts">
    import { onMount } from 'svelte'

    import Sidebar from './components/Sidebar.svelte'

    console.log("hello")

    onMount(() => console.log("it's me"))
</script>

<style lang="scss" global>
    @import "../scss/global.scss";
</style>

<Sidebar />
