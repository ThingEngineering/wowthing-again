<script lang="ts">
    import { writable } from 'svelte/store'

    import { uiIcons } from '@/shared/icons'
    import { settingsStore } from '@/shared/stores/settings'
    import { settingsState } from '@/stores/local-storage'
    import type { SettingsView } from '@/shared/stores/settings/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'

    const deleting = writable<string>(null)

    const newView = () => {
        const view: SettingsView = {
            id: crypto.randomUUID(),
            name: 'NEW',
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

    const moveUpClick = (index: number) => {
        const newViews = $settingsStore.views.slice()
        const temp = newViews[index - 1]
        newViews[index - 1] = newViews[index]
        newViews[index] = temp
        $settingsStore.views = newViews
        $deleting = null
    }

    const moveDownClick = (index: number) => {
        const newViews = $settingsStore.views.slice()
        const temp = newViews[index + 1]
        newViews[index + 1] = newViews[index]
        newViews[index] = temp
        $settingsStore.views = newViews
        $deleting = null
    }

    const deleteConfirmClick = (index: number) => {
        const newViews = $settingsStore.views.slice(0, index)
            .concat($settingsStore.views.slice(index + 1))
        $settingsStore.views = newViews
        $deleting = null
    }
</script>

<style lang="scss">
    table {
        --image-margin-top: -4px;
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid $border-color;
    }
    .name {
        @include cell-width(12rem);
    }
    .icon {
        @include cell-width(1.2rem);

        :global(svg) {
            cursor: pointer;
        }
        :global(svg:focus) {
            outline: none;
        }
    }
    .deleting {
        border-bottom-width: 0;
        border-right-width: 0;
        padding-left: 1rem;

        :global(svg) {
            cursor: pointer;
        }
    }
    button {
        background: darken($color-success, 40%);
        border: 1px solid darken($color-success, 20%);
        border-radius: $border-radius;
        cursor: pointer;
        margin-top: 0.75rem;
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
                                on:click={() => moveUpClick(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td class="icon">
                        {#if viewIndex > 0 && viewIndex < ($settingsStore.views.length - 1)}
                            <IconifyIcon
                                icon={uiIcons.chevronDown}
                                scale={'1.2'}
                                tooltip={'Move down'}
                                on:click={() => moveDownClick(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td
                        class="icon"
                        class:border-right={$deleting === view.id}
                    >
                        {#if viewIndex > 0}
                            <IconifyIcon
                                extraClass={'status-fail'}
                                icon={uiIcons.no}
                                tooltip={'Delete'}
                                on:click={() => deleting.update((current) => current === view.id ? null : view.id)}
                            />
                        {/if}
                    </td>
                    {#if $deleting === view.id}
                        <td class="deleting">
                            Permanently delete?
                            <IconifyIcon
                                extraClass={'status-fail'}
                                icon={uiIcons.yes}
                                tooltip={'Delete'}
                                on:click={() => deleteConfirmClick(viewIndex)}
                            />
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>

    {#if $settingsStore.views.length < 10}
        <button
            class="group-entry"
            on:click={newView}
        >
            New View
        </button>
    {/if}
</div>
