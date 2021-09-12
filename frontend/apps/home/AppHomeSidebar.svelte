<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { userStore } from '@/stores'

    import Sidebar from '@/components/common/Sidebar.svelte'
</script>

<style lang="scss">
</style>

<Sidebar>
    <li use:active={'/'}>
        <a href="#/">Home</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/currencies/*'}>
        <a href="#/currencies/shadowlands">Currencies</a>
    </li>
    <li use:active={'/gear/*'}>
        <a href="#/gear/">Gear</a>
    </li>
    <li use:active={'/lockouts'}>
        <a href="#/lockouts">Lockouts</a>
    </li>
    <li use:active={'/mythicplus/*'}>
        <a href="#/mythicplus/this-week">Mythic+</a>
    </li>
    <li use:active={'/progress/*'}>
        <a href="#/progress/shadowlands">Progress</a>
    </li>
    <li use:active={'/reputations/*'}>
        <a href="#/reputations/shadowlands">Reputations</a>
    </li>
    <li use:active={'/transmog/*'}>
        <a href="#/transmog/shadowlands">Transmog</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/mounts/*'}>
        <a href="#/mounts/">Mounts</a>
    </li>
    <li use:active={'/pets/*'}>
        <a href="#/pets/">Pets</a>
    </li>
    <li use:active={'/toys/*'}>
        <a href="#/toys/">Toys</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/achievements/*'}>
        <a href="#/achievements/summary">🚧 Achievements</a>
    </li>
    <li use:active={'/farms/*'}>
        <a href="#/farms/">🐮 Farms</a>
    </li>
    <li use:active={'/cards'}>
        <a href="#/cards">🚧 Home (Cards)</a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li class="separator"></li>
        <li use:active={'/settings/*'}>
            <a href="#/settings/">Settings</a>
        </li>
    {/if}
</Sidebar>
