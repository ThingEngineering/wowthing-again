<script lang="ts">
    import { settingsState } from '@/stores/local-storage'
    import { settingsStore } from '@/shared/stores/settings'
    import type { SettingsView } from '@/shared/stores/settings/types'

    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'

    const newView = () => {
        const view: SettingsView = {
            id: crypto.randomUUID(),
            name: 'VIEW',
            characterFilter: '',
            groups: ['groupBy'],
            groupBy: [],
            sortBy: [],
            commonFields: [],
            homeFields: [],
            homeLockouts: [],
            homeTasks: [],
            disabledChores: {},
        }

        const newCustomViews = ($settingsStore.views || []).slice()
        newCustomViews.push(view)

        $settingsStore.views = newCustomViews
        $settingsState.selectedView = view.id
    }
</script>

<style lang="scss">

</style>

<div class="settings-block">
    <UnderConstruction />

    <h3>Views</h3>

    <table class="table table-striped">
        <tbody>
            {#each $settingsStore.views as view}
                <tr>
                    <td class="name">
                        {view.name}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="groups-wrapper">
        <div class="group-list">
            
            {#if $settingsStore.views.length < 10}
                <button
                    class="group-entry"
                    on:click={newView}
                >
                    New View
                </button>
            {/if}
        </div>
    </div>
</div>
