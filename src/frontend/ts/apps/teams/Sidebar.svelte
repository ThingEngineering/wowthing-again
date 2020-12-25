<script lang="ts">
    import active from 'svelte-spa-router/active'

    import Sidebar from '../../components/common/Sidebar.svelte'
</script>

<style lang="scss">
</style>

<Sidebar>
    <li use:active={'/gear'}>
        <a href="#/gear">Gear</a>
    </li>
    <li use:active={'/mythicplus'}>
        <a href="#/mythicplus">Mythic+</a>
    </li>
</Sidebar>
