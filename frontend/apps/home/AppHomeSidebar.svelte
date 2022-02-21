<script lang="ts">
    import iconBank from '@iconify/icons-mdi/bank'
    import iconCharacters from '@iconify/icons-mdi/account-group-outline'
    import iconConstruction from '@iconify/icons-emojione-monotone/construction'
    import iconCurrencies from '@iconify/icons-mdi/cash-multiple'
    import iconGear from '@iconify/icons-noto/crossed-swords'
    import iconHistory from '@iconify/icons-mdi/chart-line'
    import iconHome from '@iconify/icons-mdi/home-outline'
    import iconMythicPlus from '@iconify/icons-ic/sharp-more-time'
    import iconProgress from '@iconify/icons-mdi/progress-question'
    import iconReputations from '@iconify/icons-mdi/account-star-outline'
    import iconSets from '@iconify/icons-mdi/wardrobe-outline'
    import iconSettings from '@iconify/icons-mdi/cog-outline'
    import iconVendors from '@iconify/icons-mdi/cart-outline'
    import iconZoneMaps from '@iconify/icons-emojione-monotone/world-map'
    import active from 'svelte-spa-router/active'

    import { dropTypeIcon } from '@/data/farm'
    import { iconStrings } from '@/data/icons'
    import { journalStore, userStore, userTransmogStore } from '@/stores'
    import { userVendorStore } from '@/stores/user-vendors'
    import getPercentClass from '@/utils/get-percent-class'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Sidebar from '@/components/main-sidebar/MainSidebar.svelte'
    import { FarmDropType } from '@/types/enums'

    let journalPercent: number
    let mountsPercent: number
    let petsPercent: number
    let toysPercent: number
    let transmogPercent: number
    let vendorPercent: number
    $: {
        const journalOverall = $journalStore.data.stats['OVERALL']
        const mountsOverall = $userStore.data.setCounts['mounts']['OVERALL']
        const petsOverall = $userStore.data.setCounts['pets']['OVERALL']
        const toysOverall = $userStore.data.setCounts['toys']['OVERALL']
        const transmogOverall = $userTransmogStore.data.stats['OVERALL']
        const vendorOverall = $userVendorStore.data.stats['OVERALL']

        journalPercent = journalOverall.have / journalOverall.total * 100
        mountsPercent = mountsOverall.have / mountsOverall.total * 100
        petsPercent = petsOverall.have / petsOverall.total * 100
        toysPercent = toysOverall.have / toysOverall.total * 100
        transmogPercent = transmogOverall.have / transmogOverall.total * 100
        vendorPercent = vendorOverall.have / vendorOverall.total * 100
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
            <IconifyIcon icon={iconHome} dropShadow={true} />
            Home
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/characters/*'}>
        <a href="#/characters/">
            <IconifyIcon icon={iconCharacters} dropShadow={true} />
            Characters
        </a>
    </li>

    <li use:active={'/currencies/*'}>
        <a href="#/currencies/">
            <IconifyIcon icon={iconCurrencies} dropShadow={true} />
            Currencies
        </a>
    </li>

    <li use:active={'/gear/*'}>
        <a href="#/gear/">
            <IconifyIcon icon={iconGear} dropShadow={true} />
            Gear
        </a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li use:active={'/history/*'}>
            <a href="#/history/">
                <IconifyIcon icon={iconHistory} dropShadow={true} />
                History
            </a>
        </li>
    {/if}

    {#if $userStore.loaded && !$userStore.data.public}
        <li use:active={'/items/*'}>
            <a href="#/items/">
                <IconifyIcon icon={iconConstruction} dropShadow={true} />
                Items
            </a>
        </li>
    {/if}

    <li use:active={'/lockouts'}>
        <a href="#/lockouts">
            <IconifyIcon icon={iconStrings.lock} dropShadow={true} />
            Lockouts
        </a>
    </li>

    <li use:active={'/mythic-plus/*'}>
        <a href="#/mythic-plus/">
            <IconifyIcon icon={iconMythicPlus} dropShadow={true} />
            Mythic+
        </a>
    </li>

    <li use:active={'/progress/*'}>
        <a href="#/progress/">
            <IconifyIcon icon={iconProgress} dropShadow={true} />
            Progress
        </a>
    </li>

    <li use:active={'/reputations/*'}>
        <a href="#/reputations/">
            <IconifyIcon icon={iconReputations} dropShadow={true} />
            Reputations
        </a>
    </li>

    <li class="separator"></li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li use:active={'/auctions/*'}>
            <a href="#/auctions/">
                <IconifyIcon icon={iconBank} dropShadow={true} />
                Auctions
            </a>
        </li>
    {/if}

    <li use:active={'/mounts/*'}>
        <a href="#/mounts/">
            <IconifyIcon icon={dropTypeIcon[FarmDropType.Mount]} dropShadow={true} />
            Mounts
        </a>
        <span class="drop-shadow percent {getPercentClass(mountsPercent)}">{fancyPercent(mountsPercent)} %</span>
    </li>

    <li use:active={'/pets/*'}>
        <a href="#/pets/">
            <IconifyIcon icon={dropTypeIcon[FarmDropType.Pet]} dropShadow={true} />
            Pets
        </a>
        <span class="drop-shadow percent {getPercentClass(petsPercent)}">{fancyPercent(petsPercent)} %</span>
    </li>

    <li use:active={'/toys/*'}>
        <a href="#/toys/">
            <IconifyIcon icon={dropTypeIcon[FarmDropType.Toy]} dropShadow={true} />
            Toys
        </a>
        <span class="drop-shadow percent {getPercentClass(toysPercent)}">{fancyPercent(toysPercent)} %</span>
    </li>

    <li class="separator"></li>

    <li use:active={'/journal/*'}>
        <a href="#/journal/">
            <IconifyIcon icon={dropTypeIcon[FarmDropType.Cosmetic]} dropShadow={true} />
            Journal
        </a>
        <span class="drop-shadow percent {getPercentClass(journalPercent)}">{fancyPercent(journalPercent)} %</span>
    </li>

    <li use:active={'/appearances/*'}>
        <a href="#/appearances/">
            <IconifyIcon icon={iconSets} dropShadow={true} />
            Sets
        </a>
        <span class="drop-shadow percent {getPercentClass(transmogPercent)}">{fancyPercent(transmogPercent)} %</span>
    </li>

    <li use:active={'/vendors/*'}>
        <a href="#/vendors/">
            <IconifyIcon icon={iconVendors} dropShadow={true} />
            Vendors
        </a>
        <span class="drop-shadow percent {getPercentClass(vendorPercent)}">{fancyPercent(vendorPercent)} %</span>
    </li>

    <li use:active={'/zone-maps/*'}>
        <a href="#/zone-maps/">
            <IconifyIcon icon={iconZoneMaps} dropShadow={true} />
            Zone Maps
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/achievements/*'}>
        <a href="#/achievements/summary">
            <IconifyIcon icon={iconConstruction} dropShadow={true} />
            Achievements
        </a>
    </li>

    <li use:active={'/cards'}>
        <a href="#/cards">
            <IconifyIcon icon={iconConstruction} dropShadow={true} />
            Home (Cards)
        </a>
    </li>

    {#if $userStore.loaded && !$userStore.data.public}
        <li class="separator"></li>

        <li use:active={'/settings/*'}>
            <a href="#/settings/">
                <IconifyIcon icon={iconSettings} dropShadow={true} />
                Settings
            </a>
        </li>
    {/if}
</Sidebar>
