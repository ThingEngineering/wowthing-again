<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { navItems } from '@/data/nav'
    import { iconLibrary } from '@/icons'
    import { settingsStore, userStore } from '@/stores'
    import tippy from '@/utils/tippy'

    import CharacterFilter from './AppHomeCharacterFilter.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Sidebar from '@/components/main-sidebar/MainSidebar.svelte'
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

    .character-filter-wrapper {
        margin: 1rem 0 0 0;
        width: 10.2rem;
    }
</style>

<Sidebar>
    {#each navItems as [path, linkText, iconName, privateOnly]}
        {#if path !== null}
            {#if !privateOnly
                || (privateOnly && linkText === 'Currencies' && $settingsStore.privacy.publicCurrencies)
                || ($userStore.loaded && !$userStore.public)
            }
                <li
                    use:active={path.endsWith('/') ? `/${path}*` : `/${path}`}
                    use:tippy={linkText}
                >
                    <a
                        class:wip={linkText.indexOf('WIP') >= 0}
                        href="#/{path}"
                    >
                        <IconifyIcon
                            icon={iconLibrary[iconName]}
                            dropShadow={true}
                        />
                        {linkText}
                    </a>
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
