<script lang="ts">
    import { settingsState } from '@/stores/local-storage'
    import { settingsStore } from '@/user-home/stores/settings'
    import type { SettingsView } from '@/user-home/stores/settings/types'

    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'
    import View from './SettingsLayoutViewsView.svelte'

    const newView = () => {
        const view: SettingsView = {
            id: crypto.randomUUID(),
            name: 'VIEW',
            groups: ['groupBy'],
            groupBy: [],
            sortBy: [],
            commonFields: [],
            homeFields: [],
            homeLockouts: [],
            homeTasks: [],
        }

        const newCustomViews = ($settingsStore.views || []).slice()
        newCustomViews.push(view)

        $settingsStore.views = newCustomViews
        $settingsState.selectedView = view.id
    }

    const setActive = (viewId: string) => {
        $settingsState.selectedView = viewId
    }
</script>

<style lang="scss">
    .groups-wrapper {
        display: flex;
        gap: 1rem;
    }
    .group-list {
        width: 8rem;
    }
    .group-entry {
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
        border-top: 1px solid $border-color;
        cursor: pointer;
        padding: 0.3rem 0.5rem;

        &.active {
            background: $active-background;
        }

        &:nth-last-child(-n + 2) {
            border-bottom: 1px solid $border-color;
        }
        &:nth-last-child(2) {
            margin-bottom: 1rem;
        }
        &:last-child {
            background: #242;
        }
    }
</style>

<div class="settings-block">
    <UnderConstruction />

    <h3>Views</h3>

    <div class="groups-wrapper">
        <div class="group-list">
            {#each $settingsStore.views as view}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="group-entry text-overflow"
                    class:active={$settingsState.selectedView === view.id}
                    on:click={() => setActive(view.id)}
                >
                    {view.name}
                </div>
            {/each}
            
            {#if $settingsStore.views.length < 5}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="group-entry"
                    on:click={newView}
                >
                    New View
                </div>
            {/if}
        </div>

        {#if $settingsState.selectedView}
            <View view={$settingsStore.views.filter((view) => view.id === $settingsState.selectedView)[0]} />
        {/if}
    </div>
</div>
