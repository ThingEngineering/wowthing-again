<script lang="ts">
    import active from 'svelte-spa-router/active';

    import { navItems } from '@/data/nav';
    import { iconLibrary } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { lazyStore, userStore } from '@/stores';
    import getPercentClass from '@/utils/get-percent-class';

    import CharacterFilter from './CharacterFilter.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';

    $: filteredNavItems = navItems.filter(
        (navItem) => navItem === null || !navItem.showFunc || navItem.showFunc(settingsState.value),
    );
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
        overflow: unset;
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
        position: relative;

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
    .percent {
        border-color: #999;
        bottom: -10px;
        font-size: 85%;
        padding: 1px 2px 2px 2px;
        position: absolute;
    }
</style>

<nav class="subnav" class:subnav-big={settingsState.value.layout.newNavigationIcons}>
    {#each filteredNavItems as navItem, navIndex (navIndex)}
        {#if navItem !== null}
            {#if !navItem.privateOnly || (navItem.privateOnly && navItem.text === 'Currencies' && settingsState.value.privacy.publicCurrencies) || ($userStore.loaded && !sharedState.public)}
                {@const percent = navItem.percentFunc?.($lazyStore)}
                <a
                    class:spacer={navIndex < filteredNavItems.length &&
                        !filteredNavItems[navIndex + 1]?.path}
                    class:wip={navItem.text.indexOf('WIP') >= 0}
                    href="#/{navItem.path}"
                    use:active={navItem.path.endsWith('/')
                        ? `/${navItem.path}*`
                        : `/${navItem.path}`}
                    use:basicTooltip={navItem.text}
                >
                    <IconifyIcon icon={iconLibrary[navItem.icon]} dropShadow={true} />

                    {#if !settingsState.value.layout.newNavigationIcons}
                        {navItem.text}
                    {/if}

                    {#if percent}
                        <span class="percent pill abs-center {getPercentClass(percent)}">
                            {percent.toFixed(1)}%
                        </span>
                    {/if}
                </a>
            {/if}
        {/if}
    {/each}

    <CharacterFilter />
</nav>
