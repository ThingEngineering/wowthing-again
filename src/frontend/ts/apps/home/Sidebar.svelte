<script lang="ts">
    import active from 'svelte-spa-router/active'

    import Sidebar from '@/components/common/Sidebar.svelte'
</script>

<style lang="scss">
</style>

<Sidebar>
    <li use:active={'/'}>
        <a href="#/">Home (Cards)</a>
    </li>
    <li use:active={'/table'}>
        <a href="#/table">Home (Table)</a>
    </li>
    <li class="separator"></li>
    <li use:active={'/gear'}>
        <a href="#/gear">Gear</a>
    </li>
    <li use:active={'/mythicplus/*'}>
        <a href="#/mythicplus/thisweek">Mythic+</a>
    </li>
    <li use:active={'/reputations/*'}>
        <a href="#/reputations/shadowlands">Reputations</a>
    </li>
    <li class="separator"></li>
    <li use:active={'/mounts/*'}>
        <a href="#/mounts/">Mounts</a>
    </li>
    <li class="separator"></li>
    <li use:active={'/pets/*'}>
        <a href="#/pets/">🚧 Pets</a>
    </li>
    <li use:active={'/toys/*'}>
        <a href="#/toys/">🚧 Toys</a>
    </li>
    <li use:active={'/transmog/*'}>
        <a href="#/transmog/shadowlands">🚧 Transmog</a>
    </li>
    <li class="separator"></li>
    <li use:active={'/settings/*'}>
        <a href="#/settings/">🚧 Settings</a>
    </li>
</Sidebar>
