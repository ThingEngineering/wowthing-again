<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { browserState } from '@/shared/state/browser.svelte';
    import type { SettingsCustomGroup } from '@/shared/stores/settings/types';

    import Group from './SettingsLayoutGroupingGroup.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    const newGroup = () => {
        const group: SettingsCustomGroup = {
            filter: '',
            id: crypto.randomUUID(),
            name: 'GROUP',
        };

        const newCustomGroups = (settingsState.value.customGroups || []).slice();
        newCustomGroups.push(group);

        settingsState.value.customGroups = newCustomGroups;
        browserState.current.settings.selectedGroup = group.id;
    };

    const setActive = (groupId: string) => {
        console.log(groupId);
        browserState.current.settings.selectedGroup = groupId;
    };
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
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        border-top: 1px solid var(--border-color);
        cursor: pointer;
        padding: 0.3rem 0.5rem;

        &.active {
            background: $active-background;
        }

        &:nth-last-child(-n + 2) {
            border-bottom: 1px solid var(--border-color);
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

    <h3>Custom Groups</h3>

    <div class="groups-wrapper">
        <div class="group-list">
            {#each settingsState.value.customGroups as customGroup (customGroup.id)}
                <button
                    class="group-entry text-overflow"
                    class:active={browserState.current.settings.selectedGroup === customGroup.id}
                    on:click={() => setActive(customGroup.id)}
                >
                    {customGroup.name}
                </button>
            {/each}

            {#if settingsState.value.customGroups.length < 10}
                <button class="group-entry" on:click={newGroup}> New group </button>
            {/if}
        </div>

        {#if browserState.current.settings.selectedGroup}
            <Group
                group={settingsState.value.customGroups.filter(
                    (group) => group.id === browserState.current.settings.selectedGroup
                )[0]}
            />
        {/if}
    </div>
</div>
