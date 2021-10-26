<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { userCollectionStore, userStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    import Sidebar from '@/components/common/Sidebar.svelte'

    let mountsPercent: number
    let petsPercent: number
    let toysPercent: number
    $: {
        const mountsOverall = $userCollectionStore.data.setCounts['mounts']['OVERALL']
        const petsOverall = $userCollectionStore.data.setCounts['pets']['OVERALL']
        const toysOverall = $userCollectionStore.data.setCounts['toys']['OVERALL']

        mountsPercent = mountsOverall.have / mountsOverall.total * 100
        petsPercent = petsOverall.have / petsOverall.total * 100
        toysPercent = toysOverall.have / toysOverall.total * 100
    }

    const fancyPercent = (percent: number): string => {
        return (Math.floor(percent * 10) / 10).toFixed(1)
    }
</script>

<style lang="scss">
    li {
        position: relative;
    }

    .percent {
        pointer-events: none;
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        word-spacing: -0.2ch;
    }
</style>

<Sidebar>
    <li use:active={'/'}>
        <a href="#/">Home</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/currencies/*'}>
        <a href="#/currencies/">Currencies</a>
    </li>
    <li use:active={'/gear/*'}>
        <a href="#/gear/">Gear</a>
    </li>
    <li use:active={'/lockouts'}>
        <a href="#/lockouts">Lockouts</a>
    </li>
    <li use:active={'/mythic-plus/*'}>
        <a href="#/mythic-plus/">Mythic+</a>
    </li>
    <li use:active={'/progress/*'}>
        <a href="#/progress/">Progress</a>
    </li>
    <li use:active={'/reputations/*'}>
        <a href="#/reputations/">Reputations</a>
    </li>

    <li class="separator"></li>
    <li use:active={'/mounts/*'}>
        <a href="#/mounts/">Mounts</a>
        <span class="drop-shadow percent {getPercentClass(mountsPercent)}">{fancyPercent(mountsPercent)} %</span>
    </li>
    <li use:active={'/pets/*'}>
        <a href="#/pets/">Pets</a>
        <span class="drop-shadow percent {getPercentClass(petsPercent)}">{fancyPercent(petsPercent)} %</span>
    </li>
    <li use:active={'/toys/*'}>
        <a href="#/toys/">Toys</a>
        <span class="drop-shadow percent {getPercentClass(toysPercent)}">{fancyPercent(toysPercent)} %</span>
    </li>

    <li class="separator"></li>

    <li use:active={'/transmog-sets/*'}>
        <a href="#/transmog-sets/">Transmog Sets</a>
    </li>
    <li use:active={'/zone-maps/*'}>
        <a href="#/zone-maps/">Zone Maps</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/achievements/*'}>
        <a href="#/achievements/summary">🚧 Achievements</a>
    </li>
    <li use:active={'/cards'}>
        <a href="#/cards">🚧 Home (Cards)</a>
    </li>
    <li use:active={'/teams'}>
        <a href="#/teams">🚧 Teams</a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li class="separator"></li>
        <li use:active={'/settings/*'}>
            <a href="#/settings/">Settings</a>
        </li>
    {/if}
</Sidebar>
