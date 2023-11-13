<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { navItems } from '@/data/nav'
    import { iconLibrary } from '@/shared/icons'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { userStore } from '@/stores'
    import { settingsStore } from '@/shared/stores/settings'

    import CharacterFilter from './CharacterFilter.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
</script>

<style lang="scss">
    .subnav {
        --image-margin-top: -0.2rem;

        align-items: center;
        background: transparent;
        border-width: 0;
        //display: flex;
        flex-wrap: wrap;
        //font-size: 1.1rem;
        margin: -1px 0 0 0;
        padding: 0 1rem;
        position: sticky;
        top: 0;
        width: 100%;
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
            {#if !privateOnly
                || (privateOnly && linkText === 'Currencies' && $settingsStore.privacy.publicCurrencies)
                || ($userStore.loaded && !$userStore.public)
            }
                <a 
                    class:spacer={navIndex < (navItems.length) && !navItems[navIndex+1]?.[0]}
                    class:wip={linkText.indexOf('WIP') >= 0}
                    href="#/{path}"
                    use:active={path.endsWith('/') ? `/${path}*` : `/${path}`}
                    use:basicTooltip={linkText}
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
