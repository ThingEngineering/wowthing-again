<script lang="ts">
    import { uiIcons } from '@/shared/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SettingsView } from '@/shared/stores/settings/types';

    import Button from '@/shared/components/forms/Button.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import TextArea from '@/shared/components/forms/TextArea.svelte';

    let deleting = $state<string>(null);
    let importJson = $state<string>('');

    let importEnabled = $derived.by(() => {
        if (!importJson) {
            return false;
        }

        let parsed: SettingsView;
        try {
            parsed = JSON.parse(importJson);
        } catch {
            return false;
        }

        return (
            parsed &&
            typeof parsed === 'object' &&
            typeof parsed.name === 'string' &&
            typeof parsed.characterFilter === 'string' &&
            typeof parsed.showCompletedUntrackedChores === 'boolean' &&
            typeof parsed.choreFilters === 'object' &&
            typeof parsed.disabledChores === 'object' &&
            [
                'groups',
                'groupBy',
                'sortBy',
                'commonFields',
                'homeCurrencies',
                'homeFields',
                'homeItems',
                'homeLockouts',
                'homeProfessionsV2',
                'homeProgress',
                'homeTasks',
            ].every((k) => Array.isArray(parsed[k as keyof SettingsView]))
        );
    });

    const newView = (changeView = true) => {
        const view: SettingsView = {
            id: crypto.randomUUID(),
            name: 'NEW',
            characterFilter: '',
            showCompletedUntrackedChores: false,
            groups: ['groupBy'],
            groupBy: [],
            sortBy: [],
            commonFields: settingsState.value.views[0].commonFields,
            homeCurrencies: [],
            homeFields: [],
            homeItems: [],
            homeLockouts: [],
            homeProfessionsV2: [],
            homeProgress: [],
            homeTasks: [],
            choreFilters: {},
            disabledChores: {},
        };

        const newCustomViews = (settingsState.value.views || []).slice();
        newCustomViews.push(view);

        settingsState.value.views = newCustomViews;

        if (changeView) {
            browserState.current.settings.selectedView = view.id;
        }

        return view;
    };

    const importView = () => {
        const parsed = JSON.parse(importJson);

        const view = newView(false);
        view.name = `${parsed.name} [IMPORT]`;
        view.characterFilter = parsed.characterFilter;
        view.showCompletedUntrackedChores = parsed.showCompletedUntrackedChores;
        view.groups = parsed.groups;
        view.groupBy = parsed.groupBy;
        view.sortBy = parsed.sortBy;
        view.commonFields = parsed.commonFields;
        view.homeCurrencies = parsed.homeCurrencies;
        view.homeFields = parsed.homeFields;
        view.homeItems = parsed.homeItems;
        view.homeLockouts = parsed.homeLockouts;
        view.homeProfessionsV2 = parsed.homeProfessionsV2;
        view.homeProgress = parsed.homeProgress;
        view.homeTasks = parsed.homeTasks;
        view.choreFilters = parsed.choreFilters;
        view.disabledChores = parsed.disabledChores;
    };

    const moveUpClick = (index: number) => {
        const newViews = settingsState.value.views.slice();
        const temp = newViews[index - 1];
        newViews[index - 1] = newViews[index];
        newViews[index] = temp;
        settingsState.value.views = newViews;
        deleting = null;
    };

    const moveDownClick = (index: number) => {
        const newViews = settingsState.value.views.slice();
        const temp = newViews[index + 1];
        newViews[index + 1] = newViews[index];
        newViews[index] = temp;
        settingsState.value.views = newViews;
        deleting = null;
    };

    const deleteConfirmClick = (viewId: string) => {
        deleting = null;
        settingsState.value.views = settingsState.value.views.filter((view) => view.id !== viewId);

        if (settingsState.activeView.id === viewId) {
            browserState.current.home.activeView = settingsState.value.views[0].id;
        }
    };
</script>

<style lang="scss">
    table {
        --image-margin-top: -4px;
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid var(--border-color);
    }
    .name {
        --width: 12rem;
    }
    .icon {
        --width: 1.2rem;

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
</style>

<h2>Views</h2>

<div class="settings-block">
    <p>
        The first View will be used as your default grouping/sorting on pages other than Home, don't
        set it to anything that will annoy you.
    </p>

    <table class="table table-striped">
        <tbody>
            {#each settingsState.value.views as view, viewIndex (view.id)}
                <tr>
                    <td class="name text-overflow">
                        {view.name}
                    </td>
                    <td class="icon">
                        {#if viewIndex > 0}
                            <IconifyWrapper
                                icon={uiIcons.chevronUp}
                                scale="1.2"
                                tooltip="Move up"
                                onclick={() => moveUpClick(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td class="icon">
                        {#if viewIndex < settingsState.value.views.length - 1}
                            <IconifyWrapper
                                icon={uiIcons.chevronDown}
                                scale="1.2"
                                tooltip="Move down"
                                onclick={() => moveDownClick(viewIndex)}
                            />
                        {/if}
                    </td>
                    <td class="icon" class:border-right={deleting === view.id}>
                        {#if viewIndex > 0}
                            <IconifyWrapper
                                cls="status-fail"
                                icon={uiIcons.no}
                                tooltip="Delete"
                                onclick={() => (deleting = deleting === view.id ? null : view.id)}
                            />
                        {/if}
                    </td>
                    {#if deleting === view.id}
                        <td class="deleting">
                            Permanently delete?
                            <IconifyWrapper
                                cls="status-fail"
                                icon={uiIcons.yes}
                                tooltip="Delete"
                                onclick={() => deleteConfirmClick(view.id)}
                            />
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>

    {#if settingsState.value.views.length < 10}
        <button class="group-entry bg-success border b-success b-radius" onclick={newView}>
            New View
        </button>
    {/if}
</div>

<div class="settings-block">
    <TextArea placeholder="Paste view JSON here" rows={8} bind:value={importJson} />
    <Button
        cls={importEnabled ? 'bg-success border-success' : 'bg-warn border-warn'}
        disabled={!importEnabled}
        onclick={importView}>Import View</Button
    >
</div>
