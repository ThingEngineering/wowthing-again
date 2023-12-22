<script lang="ts">
    import { uiIcons } from '@/shared/icons'
    import { settingsStore } from '@/shared/stores/settings'
    import { settingsState } from '@/stores/local-storage'
    import type { SettingsView } from '@/shared/stores/settings/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
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

    const moveUp = (index: number) => {
        const newViews = $settingsStore.views.slice()
        const temp = newViews[index - 1]
        newViews[index - 1] = newViews[index]
        newViews[index] = temp
        $settingsStore.views = newViews
    }

    const moveDown = (index: number) => {
        const newViews = $settingsStore.views.slice()
        const temp = newViews[index + 1]
        newViews[index + 1] = newViews[index]
        newViews[index] = temp
        $settingsStore.views = newViews
    }
</script>

<style lang="scss">
    table {
        --padding: 2;

        border-top: 1px solid $border-color;
    }
    .name {
        @include cell-width(12rem);
    }
    .icon {
        :global(svg) {
            cursor: pointer;
        }
    }
    .delete {
        color: $color-fail;
    }
</style>

<div class="settings-block">
    <UnderConstruction />

    <h3>Views</h3>

    <table class="table table-striped">
        <tbody>
            {#each $settingsStore.views as view, viewIndex}
                <tr>
                    <td class="name text-overflow">
                        {view.name}
                    </td>
                    <td class="icon">
                        {#if viewIndex > 1}
                            <IconifyIcon
                                icon={uiIcons.chevronUp}
                                scale={'1.2'}
                                tooltip={'Move up'}
                                on:click={() => moveUp(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td class="icon">
                        {#if viewIndex > 0 && viewIndex < ($settingsStore.views.length - 1)}
                            <IconifyIcon
                                icon={uiIcons.chevronDown}
                                scale={'1.2'}
                                tooltip={'Move down'}
                                on:click={() => moveDown(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td class="icon delete">
                        {#if viewIndex > 0}
                            <IconifyIcon
                                icon={uiIcons.no}
                                tooltip={'Delete'}
                            />
                        {/if}
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
