<script lang="ts">
    import { link } from 'svelte-spa-router'

    import { iconLibrary } from '@/shared/icons'
    import { settingsStore } from '@/shared/stores/settings'
    import { userStore } from '@/stores'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
</script>

<style lang="scss">
    div {
        display: flex;
        gap: 0.3rem;
    }
    a, button {
        border: 1px solid $border-color;
        border-top-left-radius: $border-radius-large;
        border-top-right-radius: $border-radius-large;
        cursor: pointer;
        margin-bottom: -1px;
        padding: 0.2rem 0.5rem;
        z-index: 10;

        &.active {
            background: $active-background;
            border-color: #ddd;
            color: #fff;
        }
    }
</style>

<div>
    {#each $settingsStore.views as view, viewIndex}
        <button
            class:active={$settingsStore.activeView === view.id || (!$settingsStore.activeView && viewIndex === 0)}
            data-id={view.id}
            on:click={() => $settingsStore.activeView = view.id}
        >
            {view.name}
        </button>
    {/each}

    {#if !$userStore.public}
        <a href="/settings/views/{$settingsStore.activeView}" use:link>
            <IconifyIcon
                icon={iconLibrary.mdiCogOutline}
            />
        </a>
    {/if}
</div>
