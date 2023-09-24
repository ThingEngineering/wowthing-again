<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { iconStrings, rewardTypeIcons } from '@/data/icons'
    import { RewardType } from '@/enums'
    import { iconLibrary } from '@/icons'
    import { lazyStore, settingsStore, userStore, userTransmogStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    import CharacterFilter from './AppHomeCharacterFilter.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Sidebar from '@/components/main-sidebar/MainSidebar.svelte'

    let transmogSetsPercent: number
    $: {
        const transmogSetsOverall = $userTransmogStore.statsV2['OVERALL']
        transmogSetsPercent = transmogSetsOverall.have / transmogSetsOverall.total * 100
    }

    $: journalPercent = $lazyStore.journal.stats.OVERALL.percent
    $: mountsPercent = $lazyStore.mounts.stats.OVERALL.percent
    $: petsPercent = $lazyStore.pets.stats.OVERALL.percent
    $: toysPercent = $lazyStore.toys.stats.OVERALL.percent
    $: transmogPercent = $lazyStore.transmog.stats.OVERALL.percent
    $: vendorPercent = $lazyStore.vendors.stats.OVERALL.percent

    const fancyPercent = (percent: number): string => {
        return (Math.floor(percent * 10) / 10).toFixed(1)
    }
</script>

<style lang="scss">
    li {
        --image-margin-top: -4px;

        position: relative;

        :global(svg) {
            color: #eee;
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
    .character-filter-wrapper {
        margin: 1rem 0 0 0;
        width: 10.2rem;
    }
</style>

<Sidebar>
    <li use:active={'/'}>
        <a href="#/">
            <IconifyIcon icon={iconLibrary.mdiHomeOutline} dropShadow={true} />
            Home
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/characters/*'}>
        <a href="#/characters/">
            <IconifyIcon icon={iconLibrary.mdiAccountGroupOutline} dropShadow={true} />
            Characters
        </a>
    </li>

    {#if $userStore.loaded && (!$userStore.public || $settingsStore.privacy.publicCurrencies)}
        <li use:active={'/currencies/*'}>
            <a href="#/currencies/">
                <IconifyIcon icon={iconLibrary.mdiCashMultiple} dropShadow={true} />
                Currencies
            </a>
        </li>
    {/if}

    {#if $userStore.loaded && !$userStore.public}
        <li use:active={'/history/*'}>
            <a href="#/history/">
                <IconifyIcon icon={iconLibrary.mdiChartLine} dropShadow={true} />
                History
            </a>
        </li>
    {/if}

    {#if $userStore.loaded && !$userStore.public}
        <li use:active={'/items/*'}>
            <a href="#/items/">
                <IconifyIcon icon={iconLibrary.notoCrossedSwords} dropShadow={true} />
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
            <IconifyIcon icon={iconLibrary.icSharpMoreTime} dropShadow={true} />
            Mythic+
        </a>
    </li>

    <li use:active={'/progress/*'}>
        <a href="#/progress/">
            <IconifyIcon icon={iconLibrary.mdiProgressQuestion} dropShadow={true} />
            Progress
        </a>
    </li>

    <li use:active={'/reputations/*'}>
        <a href="#/reputations/">
            <IconifyIcon icon={iconLibrary.mdiAccountStarOutline} dropShadow={true} />
            Reputations
        </a>
    </li>

    {#if $userStore.loaded && !$userStore.public}
        <li class="separator"></li>

        <li use:active={'/auctions/*'}>
            <a href="#/auctions/">
                <IconifyIcon icon={iconLibrary.mdiBank} dropShadow={true} />
                Auctions
            </a>
        </li>
    {/if}

    <li class="separator"></li>

    <li use:active={'/collections/*'}>
        <a href="#/collections">
            <IconifyIcon icon={iconLibrary.gameCompanionCube} dropShadow={true} />
            Collections
        </a>
    </li>

    <li use:active={'/mounts/*'}>
        <a href="#/mounts/">
            <IconifyIcon icon={rewardTypeIcons[RewardType.Mount]} dropShadow={true} />
            Mounts
        </a>
        <span class="drop-shadow percent {getPercentClass(mountsPercent)}">{fancyPercent(mountsPercent)} %</span>
    </li>

    <li use:active={'/pets/*'}>
        <a href="#/pets/">
            <IconifyIcon icon={rewardTypeIcons[RewardType.Pet]} dropShadow={true} />
            Pets
        </a>
        <span class="drop-shadow percent {getPercentClass(petsPercent)}">{fancyPercent(petsPercent)} %</span>
    </li>

    <li use:active={'/toys/*'}>
        <a href="#/toys/">
            <IconifyIcon icon={rewardTypeIcons[RewardType.Toy]} dropShadow={true} />
            Toys
        </a>
        <span class="drop-shadow percent {getPercentClass(toysPercent)}">{fancyPercent(toysPercent)} %</span>
    </li>

    <li class="separator"></li>

    <li use:active={'/journal/*'}>
        <a href="#/journal/">
            <IconifyIcon icon={rewardTypeIcons[RewardType.Cosmetic]} dropShadow={true} />
            Journal
        </a>
        <span class="drop-shadow percent {getPercentClass(journalPercent)}">{fancyPercent(journalPercent)} %</span>
    </li>

    <li use:active={'/sets/*'}>
        <a href="#/sets/">
            <IconifyIcon icon={iconLibrary.mdiWardrobeOutline} dropShadow={true} />
            Sets
        </a>
        <span class="drop-shadow percent {getPercentClass(transmogPercent)}">{fancyPercent(transmogPercent)} %</span>
    </li>

    <li use:active={'/vendors/*'}>
        <a href="#/vendors/">
            <IconifyIcon icon={iconLibrary.mdiCartOutlineiconVendors} dropShadow={true} />
            Vendors
        </a>
        <span class="drop-shadow percent {getPercentClass(vendorPercent)}">{fancyPercent(vendorPercent)} %</span>
    </li>

    <li use:active={'/zone-maps/*'}>
        <a href="#/zone-maps/">
            <IconifyIcon icon={iconLibrary.emojiWorldMap} dropShadow={true} />
            Zone Maps
        </a>
    </li>

    <li class="separator"></li>

    <li use:active={'/achievements/*'}>
        <a href="#/achievements/">
            <IconifyIcon icon={iconLibrary.emojiConstruction} dropShadow={true} />
            Achievements
        </a>
    </li>

    <li use:active={'/matrix'}>
        <a href="#/matrix">
            <IconifyIcon icon={iconLibrary.emojiConstruction} dropShadow={true} />
            Matrix
        </a>
    </li>

    <li use:active={'/professions/*'}>
        <a href="#/professions/">
            <IconifyIcon icon={iconLibrary.emojiConstruction} dropShadow={true} />
            Professions
        </a>
    </li>

    {#if $userStore.loaded && !$userStore.public}
        <li class="separator"></li>

        <li use:active={'/settings/*'}>
            <a href="#/settings/">
                <IconifyIcon icon={iconLibrary.mdiCogOutline} dropShadow={true} />
                Settings
            </a>
        </li>
    {/if}

    <div class="character-filter-wrapper" slot="after">
        <CharacterFilter />
    </div>
</Sidebar>
