<script lang="ts">
    import active from 'svelte-spa-router/active'

    import Sidebar from '@/components/main-sidebar/MainSidebar.svelte'
</script>

<style lang="scss">
</style>

<Sidebar>
    <li use:active={'/gear'}>
        <a href="#/gear">Gear</a>
    </li>
    <li use:active={'/mythic-plus'}>
        <a href="#/mythic-plus">Mythic+</a>
    </li>
</Sidebar>
