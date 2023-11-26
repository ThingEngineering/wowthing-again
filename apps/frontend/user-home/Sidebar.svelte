<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { navItems } from '@/data/nav'
    import { iconLibrary } from '@/shared/icons'
    import { settingsStore } from '@/shared/stores/settings'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { lazyStore, userStore } from '@/stores'

    import CharacterFilter from './CharacterFilter.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import Sidebar from '@/components/main-sidebar/MainSidebar.svelte'
    import getPercentClass from '@/utils/get-percent-class';

    $: filteredNavItems = navItems
        .filter((navItem) =>
            navItem === null ||
            !navItem.showFunc ||
            navItem.showFunc($settingsStore)
        )
</script>

<style lang="scss">
    li {
        --image-margin-top: -4px;

        align-items: center;
        display: flex;
        justify-content: space-between;

        :global(svg) {
            color: #eee;
            opacity: 0.8;
        }
    }
    a {
        flex-shrink: 1;
        min-width: 0;
        white-space: nowrap;
    }
    .percent {
        font-size: 90%;
        margin-bottom: -2px;
        padding-right: 0.2rem;
        pointer-events: none;
        white-space: nowrap;
        word-spacing: -0.2ch;
    }
    .character-filter-wrapper {
        margin: 1rem 0 0 0;
        width: 10.2rem;
    }
</style>

<Sidebar>
    {#each filteredNavItems as navItem}
        {#if navItem?.path}
            {#if !navItem.privateOnly
                || (navItem.privateOnly && navItem.text === 'Currencies' && $settingsStore.privacy.publicCurrencies)
                || ($userStore.loaded && !$userStore.public)
            }
                {@const percent = navItem.percentFunc?.($lazyStore)}
                <li
                    use:active={navItem.path.endsWith('/') ? `/${navItem.path}*` : `/${navItem.path}`}
                    use:basicTooltip={navItem.text}
                >
                    <a
                        class="text-overflow"
                        class:wip={navItem.text.indexOf('WIP') >= 0}
                        href="#/{navItem.path}"
                    >
                        <IconifyIcon
                            icon={iconLibrary[navItem.icon]}
                            dropShadow={true}
                        />
                        {navItem.text}
                    </a>

                    {#if percent}
                        <span class="drop-shadow percent {getPercentClass(percent)}">
                            {percent.toFixed(1)} %
                        </span>
                    {/if}
                </li>
            {/if}
        {:else}
            <li class="separator"></li>
        {/if}
    {/each}

    <div class="character-filter-wrapper" slot="after">
        <CharacterFilter />
    </div>
</Sidebar>
