<script lang="ts">
    import { link } from 'svelte-spa-router'

    import { iconLibrary } from '@/shared/icons'
    import { browserStore } from '@/shared/stores/browser'
    import { activeView, settingsStore } from '@/shared/stores/settings'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { userStore } from '@/stores'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'

    const setActiveView = (viewId: string) => {
        $browserStore.home.activeView = viewId
    }
</script>

<style lang="scss">
    div {
        display: flex;
        gap: 0.3rem;
    }
    a, button {
        --image-border-width: 1px;

        border: 1px solid $border-color;
        border-top-left-radius: $border-radius-large;
        border-top-right-radius: $border-radius-large;
        cursor: pointer;
        margin-bottom: -1px;
        max-width: 10rem;
        padding: 0.2rem 0.5rem;
        z-index: 10;
    }
    button.active {
        background: $active-background;
        border-color: #ddd;
        color: #fff;
    }
</style>

<div>
    {#each $settingsStore.views as view}
        <button
            class="text-overflow"
            class:active={$activeView.id === view.id}
            data-id={view.id}
            on:click={() => setActiveView(view.id)}
            use:basicTooltip={view.name}
        >
            <ParsedText
                text={view.name}
            />
        </button>
    {/each}

    {#if !$userStore.public}
        <a
            href="/settings/views/{$activeView.id}"
            use:basicTooltip={'Settings'}
            use:link
        >
            <IconifyIcon
                icon={iconLibrary.mdiCogOutline}
            />
        </a>
    {/if}
</div>
