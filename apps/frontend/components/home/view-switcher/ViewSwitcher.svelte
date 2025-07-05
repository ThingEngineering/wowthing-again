<script lang="ts">
    import { link } from 'svelte-spa-router';

    import { iconLibrary } from '@/shared/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';

    import Holidays from './Holidays.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParagonQuests from '../table/paragon/ParagonQuests.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    let warbankGold = $derived(userState.general.warbankGold.toLocaleString());

    const setActiveView = (viewId: string) => {
        browserState.current.home.activeView = viewId;
    };
</script>

<style lang="scss">
    div {
        align-items: center;
        display: flex;
        gap: 0.3rem;
    }
    .tab {
        --image-border-width: 1px;

        border: 1px solid var(--border-color);
        border-top-left-radius: var(--border-radius-large);
        border-top-right-radius: var(--border-radius-large);
        cursor: pointer;
        margin-bottom: -1px;
        max-width: 10rem;
        padding: 0.2rem 0.5rem;
        z-index: 10;

        &.active {
            background: $active-background;
            border-color: #ddd;
            color: #fff;
        }
    }
    .flex-wrapper {
        gap: 0.5rem;
        margin-left: 3rem;

        :global(> *) {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-large);
            padding: 0.1rem 0.5rem;
            z-index: 10;
        }
    }
    .account-gold {
        border-color: #7f7;
    }
</style>

<div>
    {#each settingsState.value.views as view (view.id)}
        <button
            class="tab border text-overflow"
            class:active={browserState.current.home.activeView === view.id}
            data-id={view.id}
            onclick={() => setActiveView(view.id)}
            use:basicTooltip={view.name}
        >
            <ParsedText text={view.name} />
        </button>
    {/each}

    {#if !sharedState.public}
        <a
            class="tab"
            href="/settings/views/{browserState.current.home.activeView}"
            use:basicTooltip={'Settings'}
            use:link
        >
            <IconifyIcon icon={iconLibrary.mdiCogOutline} />
        </a>

        <div class="flex-wrapper">
            <span class="account-gold">
                Warbank: {warbankGold} g
            </span>

            <ParagonQuests />

            <Holidays />
        </div>
    {/if}
</div>
