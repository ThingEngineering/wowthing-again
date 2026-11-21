<script lang="ts">
    import { link } from 'svelte-spa-router';

    import { iconLibrary } from '@/shared/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';

    import Delves from './Delves.svelte';
    import Gold from './Gold.svelte';
    import Holidays from './Holidays.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import ParagonQuests from '../table/paragon/ParagonQuests.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Tasks from './Tasks.svelte';

    const setActiveView = (viewId: string) => {
        browserState.current.home.activeView = viewId;
    };
</script>

<style lang="scss">
    .view-switcher {
        display: flex;
        flex-wrap: wrap;
        gap: calc(var(--padding-size) * 2) calc(var(--padding-size) * 2);
        margin-bottom: calc(var(--padding-size) * 2);

        :global(> :nth-child(2)) {
            margin-left: 1rem;
        }
        :global(> :not(:first-child)) {
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: flex-start;

            :global(> *) {
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-large);
                padding: 0.1rem 0.5rem;
                z-index: 10;
            }
        }
    }
    .tabs {
        align-items: center;
        display: flex;
        gap: 0.3rem;
    }
    .tab {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-large);
        cursor: pointer;
        max-width: 10rem;
        padding: 0.2rem 0.5rem;
        z-index: 10;

        &.active {
            background: var(--color-active-background);
            border-color: #ddd;
            color: #fff;
        }
    }
</style>

<div class="view-switcher">
    <div class="tabs">
        {#each settingsState.value.views as view (view.id)}
            <button
                class="tab border text-overflow"
                class:active={browserState.current.home.activeView === view.id}
                data-id={view.id}
                onclick={() => setActiveView(view.id)}
                data-tooltip={view.name}
            >
                <ParsedText text={view.name} />
            </button>
        {/each}

        {#if !sharedState.public}
            <a
                class="tab"
                href="/settings/views/{browserState.current.home.activeView}"
                data-tooltip="Settings"
                use:link
            >
                <IconifyWrapper icon={iconLibrary.mdiCogOutline} />
            </a>
        {/if}
    </div>

    {#each settingsState.value.layout.homeViewSwitcher as key (key)}
        {#if key === 'delves'}
            <Delves />
        {:else if key === 'gold'}
            {#if !sharedState.public}
                <Gold />
            {/if}
        {:else if key === 'holidays'}
            <Holidays />
        {:else if key === 'paragons'}
            <ParagonQuests />
        {:else if key === 'tasks'}
            <Tasks />
        {/if}
    {/each}
</div>
