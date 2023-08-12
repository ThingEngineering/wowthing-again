<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { FarmType } from '@/enums'
    import { farmTypeIcons, iconLibrary } from '@/icons'
    import { settingsStore, userStore } from '@/stores'
    import tippy from '@/utils/tippy'

    import CharacterFilter from './AppHomeCharacterFilter.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    type NavItem = [string, string, string, boolean?]
    const navItems: NavItem[] = [
        ['', 'Home', 'mdiHomeOutline'],
        [null, null, null],
        
        ['characters/', 'Characters', 'mdiAccountGroupOutline'],
        ['currencies/', 'Currencies', 'gameCash', true],
        ['items/', 'Items', 'gameBackpack'],
        ['lockouts', 'Lockouts', 'gameLockedFortress'],
        ['mythic-plus/', 'Mythic+', 'icSharpMoreTime'],
        ['progress/', 'Progress', 'mdiProgressQuestion'],
        ['reputations/', 'Reputations', 'mdiAccountStarOutline'],
        [null, null, null],
        
        ['collections/', 'Collections', 'gameCompanionCube'],
        ['journal/', 'Journal', 'gameSecretBook'],
        ['sets/', 'Sets', 'gameHanger'],
        ['vendors/', 'Vendors', 'mdiCartOutline'],
        ['zone-maps/', 'Zone Maps', 'gameTreasureMap'],
        // ['appearances/', 'Appearances [WIP]', 'emojiConstruction'],
        // ['heirlooms/', 'Heirlooms [WIP]', 'emojiConstruction'],
        // ['illusions/', 'Illusions [WIP]', rewardTypeIcons[RewardType.Illusion]],
        // ['mounts/', 'Mounts', rewardTypeIcons[RewardType.Mount]],
        // ['pets/', 'Pets', rewardTypeIcons[RewardType.Pet]],
        // ['toys/', 'Toys', rewardTypeIcons[RewardType.Toy]],
        [null, null, null],
        
        ['auctions/', 'Auctions', 'mdiBank', true],
        ['history/', 'History', 'mdiChartLine', true],
        ['matrix', 'Matrix', 'carbonScatterMatrix'],
        [null, null, null],
        
        ['achievements/', 'Achievements [WIP]', 'gameTrophy'],
        ['professions/', 'Professions [WIP]', farmTypeIcons[FarmType.Profession]],
        [null, null, null],

        ['settings/', 'Settings', 'mdiCogOutline', true],
    ]

</script>

<style lang="scss">
    .subnav {
        --image-margin-top: -0.2rem;

        align-items: center;
        border-width: 0;
        //display: flex;
        flex-wrap: wrap;
        //font-size: 1.1rem;
        margin: 1rem 1rem 0 1rem;
        position: sticky;
        top: 0;
        width: calc(100% - 2rem);
        z-index: 100;
    }
    .subnav-big {
        --scale: 1.3;

        a {
            padding: 0.5rem 0.75rem;
        }
    }
    a {
        color: var(--link-color, #44ddff);
        padding: 0.25rem 0.7rem 0.3rem 0.5rem;

        :global(svg:focus) {
            outline: none;
        }
        &:not(.active) {
            background: darken(#2c2d2e, 5%);
        }
    }
    .spacer {
        //width: 1rem;
        margin-right: 1rem;

        + a:not(.active) {
            border-left: 1px solid $border-color;
        }
    }
    :global(.spacer + .active) {
        margin-left: 0 !important;
    }
    .wip:not(.active) {
        --link-color: #ffbb00;
    }
</style>

<nav
    class="subnav"
    class:subnav-big={$settingsStore.layout.newNavigationIcons}
>
    {#each navItems as [path, linkText, iconName, privateOnly], navIndex}
        {#if path !== null}
            {#if !privateOnly || ($userStore.loaded && !$userStore.public)}
                <a 
                    class:spacer={navIndex < (navItems.length) && !navItems[navIndex+1]?.[0]}
                    class:wip={linkText.indexOf('WIP') >= 0}
                    href="#/{path}"
                    use:active={path.endsWith('/') ? `/${path}*` : `/${path}`}
                    use:tippy={linkText}
                >
                    <IconifyIcon
                        icon={iconLibrary[iconName]}
                        dropShadow={true}
                    />
                    
                    {#if !$settingsStore.layout.newNavigationIcons}
                        {linkText}
                    {/if}
                </a>
            {/if}
        {/if}
    {/each}

    <CharacterFilter />
</nav>
