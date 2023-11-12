<script lang="ts">
    import { settingsState } from '@/stores/local-storage'
    import { settingsStore } from '@/user-home/stores/settings'
    import type { SettingsCustomGroup } from '@/user-home/stores/settings/types'

    import Group from './SettingsLayoutGroupingGroup.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'

    const newGroup = () => {
        const group: SettingsCustomGroup = {
            filter: '',
            id: crypto.randomUUID(),
            name: 'GROUP',
        }

        const newCustomGroups = ($settingsStore.customGroups || []).slice()
        newCustomGroups.push(group)

        $settingsStore.customGroups = newCustomGroups
        $settingsState.selectedGroup = group.id
    }

    const setActive = (groupId: string) => {
        $settingsState.selectedGroup = groupId
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

    <h3>Custom Groups</h3>

    <div class="groups-wrapper">
        <div class="group-list">
            {#each $settingsStore.customGroups as customGroup}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="group-entry text-overflow"
                    class:active={$settingsState.selectedGroup === customGroup.id}
                    on:click={() => setActive(customGroup.id)}
                >
                    {customGroup.name}
                </div>
            {/each}
            
            {#if $settingsStore.customGroups.length < 10}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="group-entry"
                    on:click={newGroup}
                >
                    New group
                </div>
            {/if}
        </div>

        {#if $settingsState.selectedGroup}
            <Group group={$settingsStore.customGroups.filter(group => group.id === $settingsState.selectedGroup)[0]} />
        {/if}
    </div>
</div>
