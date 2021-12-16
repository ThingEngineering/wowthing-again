<script lang="ts">
    import mdiChartLine from '@iconify/icons-mdi/chart-line'
    import mdiHomeOutline from '@iconify/icons-mdi/home-outline'
    import mdiLockOutline from '@iconify/icons-mdi/lock-outline'
    import mdiMapOutline from '@iconify/icons-mdi/map-outline'
    import mdiWardrobeOutline from '@iconify/icons-mdi/wardrobe-outline'
    import active from 'svelte-spa-router/active'

    import { dropType } from '@/data/farm'
    import { journalStore, userStore, userTransmogStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Sidebar from '@/components/common/Sidebar.svelte'

    let journalPercent: number
    let mountsPercent: number
    let petsPercent: number
    let toysPercent: number
    let transmogPercent: number
    $: {
        const journalOverall = $journalStore.data.stats['OVERALL']
        const mountsOverall = $userStore.data.setCounts['mounts']['OVERALL']
        const petsOverall = $userStore.data.setCounts['pets']['OVERALL']
        const toysOverall = $userStore.data.setCounts['toys']['OVERALL']
        const transmogOverall = $userTransmogStore.data.stats['OVERALL']

        journalPercent = journalOverall.have / journalOverall.total * 100
        mountsPercent = mountsOverall.have / mountsOverall.total * 100
        petsPercent = petsOverall.have / petsOverall.total * 100
        toysPercent = toysOverall.have / toysOverall.total * 100
        transmogPercent = transmogOverall.have / transmogOverall.total * 100
    }

    const fancyPercent = (percent: number): string => {
        return (Math.floor(percent * 10) / 10).toFixed(1)
    }
</script>

<style lang="scss">
    li {
        position: relative;

        :global(svg) {
            color: #eee;
            margin-top: -4px;
            opacity: 0.8;
        }
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
        <a href="#/">
            <IconifyIcon icon={mdiHomeOutline} />
            Home
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/currencies/*'}>
        <a href="#/currencies/">Currencies</a>
    </li>
    <li use:active={'/gear/*'}>
        <a href="#/gear/">Gear</a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li use:active={'/history/*'}>
            <a href="#/history/">
                <IconifyIcon icon={mdiChartLine} />
                History
            </a>
        </li>
    {/if}

    {#if $userStore.loaded && !$userStore.data.public}
        <li use:active={'/items/*'}>
            <a href="#/items/">🚧 Items</a>
        </li>
    {/if}

    <li use:active={'/lockouts'}>
        <a href="#/lockouts">
            <IconifyIcon icon={mdiLockOutline} />
            Lockouts
        </a>
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
        <a href="#/mounts/">
            <IconifyIcon icon={dropType.mount} />
            Mounts
        </a>
        <span class="drop-shadow percent {getPercentClass(mountsPercent)}">{fancyPercent(mountsPercent)} %</span>
    </li>
    <li use:active={'/pets/*'}>
        <a href="#/pets/">
            <IconifyIcon icon={dropType.pet} />
            Pets
        </a>
        <span class="drop-shadow percent {getPercentClass(petsPercent)}">{fancyPercent(petsPercent)} %</span>
    </li>
    <li use:active={'/toys/*'}>
        <a href="#/toys/">
            <IconifyIcon icon={dropType.toy} />
            Toys
        </a>
        <span class="drop-shadow percent {getPercentClass(toysPercent)}">{fancyPercent(toysPercent)} %</span>
    </li>

    <li class="separator"></li>

    <li use:active={'/journal/*'}>
        <a href="#/journal/">
            <IconifyIcon icon={dropType.transmog} />
            Journal
        </a>
        <span class="drop-shadow percent {getPercentClass(journalPercent)}">{fancyPercent(journalPercent)} %</span>
    </li>
    <li use:active={'/appearances/*'}>
        <a href="#/appearances/">
            <IconifyIcon icon={mdiWardrobeOutline} />
            Sets
        </a>
        <span class="drop-shadow percent {getPercentClass(transmogPercent)}">{fancyPercent(transmogPercent)} %</span>
    </li>

    <li use:active={'/zone-maps/*'}>
        <a href="#/zone-maps/">
            <IconifyIcon icon={mdiMapOutline} />
            Zone Maps
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/achievements/*'}>
        <a href="#/achievements/summary">🚧 Achievements</a>
    </li>

    <li class="separator"></li>

    <li use:active={'/cards'}>
        <a href="#/cards">🙈 Home (Cards)</a>
    </li>
    <li use:active={'/teams'}>
        <a href="#/teams">🙈 Teams</a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li class="separator"></li>
        <li use:active={'/settings/*'}>
            <a href="#/settings/">Settings</a>
        </li>
    {/if}
</Sidebar>
