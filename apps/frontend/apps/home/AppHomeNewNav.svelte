<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { FarmType, RewardType } from '@/enums'
    import { farmTypeIcons, iconLibrary, rewardTypeIcons } from '@/icons'
    import { settingsStore, userStore } from '@/stores'
    import tippy from '@/utils/tippy'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    type ShowFunction = () => boolean
    type NavItem = [string, string, string, boolean?, boolean?]
    const navItems: NavItem[] = [
        ['', 'Home', 'mdiHomeOutline'],
        [null, null, null],
        
        ['characters/', 'Characters', 'mdiAccountGroupOutline'],
        ['currencies/', 'Currencies', 'gameCash', true],
        ['gear/', 'Gear', 'gameBackpack'],
        ['history/', 'History', 'mdiChartLine'],
        ['items/', 'Items', 'emojiConstruction'],
        ['lockouts', 'Lockouts', 'gameLockedFortress'],
        ['mythic-plus/', 'Mythic+', 'icSharpMoreTime'],
        ['progress/', 'Progress', 'mdiProgressQuestion'],
        ['reputations/', 'Reputations', 'mdiAccountStarOutline'],
        [null, null, null],
        
        ['auctions/', 'Auctions', 'mdiBank', true],
        ['mounts/', 'Mounts', rewardTypeIcons[RewardType.Mount]],
        ['pets/', 'Pets', rewardTypeIcons[RewardType.Pet]],
        ['toys/', 'Toys', rewardTypeIcons[RewardType.Toy]],
        [null, null, null],
        
        ['journal/', 'Journal', 'gameSecretBook'],
        ['sets/', 'Sets', 'gameHanger'],
        ['vendors/', 'Vendors', 'mdiCartOutline'],
        ['zone-maps/', 'Zone Maps', 'gameTreasureMap'],
        [null, null, null],
        
        ['achievements/', 'Achievements [WIP]', 'gameTrophy'],
        ['appearances/', 'Appearances [WIP]', 'emojiConstruction'],
        ['collections/', 'Collections [WIP]', 'gameCompanionCube'],
        ['heirlooms/', 'Heirlooms [WIP]', 'emojiConstruction'],
        ['illusions/', 'Illusions [WIP]', rewardTypeIcons[RewardType.Illusion]],
        ['matrix', 'Matrix [WIP]', 'carbonScatterMatrix'],
        ['professions/', 'Professions [WIP]', farmTypeIcons[FarmType.Profession]],
        ['transmog-sets/', 'Sets (V2) [WIP]', 'emojiConstruction'],
        [null, null, null],

        ['settings/', 'Settings', 'mdiCogOutline', true, true],
    ]
</script>

<style lang="scss">
    .subnav {
        --image-margin-top: -0.2rem;

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
            padding: 0.5rem 0.8rem;
        }
    }
    a {
        border: 1px solid $border-color;
        color: var(--link-color, #44ddff);
        padding: 0.25rem 0.7rem 0.3rem 0.5rem;

        :global(svg:focus) {
            outline: none;
        }
        &:not(.active) {
            background: darken(#2c2d2e, 5%);
        }
        &.send-right {
            margin-left: auto;
        }
    }
    .spacer {
        //width: 1rem;
        margin-right: 1rem;
    }
    .wip:not(.active) {
        --link-color: #ffbb00;
    }
</style>

<nav
    class="subnav"
    class:subnav-big={$settingsStore.layout.newNavigationIcons}
>
    {#each navItems as [path, linkText, iconName, privateOnly, sendRight], navIndex}
        {#if path !== null}
            {#if !privateOnly || ($userStore.loaded && !$userStore.public)}
                <a 
                    class:spacer={navIndex < (navItems.length - 1) && navItems[navIndex+1][0] === null}
                    class:send-right={sendRight}
                    href="#/{path}"
                    use:active={path.endsWith('/') ? `/${path}*` : `/${path}`}
                    use:tippy={linkText}
                    class:wip={linkText.indexOf('WIP') >= 0}
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
</nav>
