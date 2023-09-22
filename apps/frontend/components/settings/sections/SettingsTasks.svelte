<script lang='ts'>
    import debounce from 'lodash/debounce'

    import { taskList } from '@/data/tasks'
    import { settingsStore } from '@/stores'
    import type { SettingsChoice } from '@/types'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Multi from './SettingsTasksMulti.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'
 
    const taskChoices: SettingsChoice[] = taskList.map((t) => ({ key: t.key, name: t.name }))

    const taskActive = $settingsStore.layout.homeTasks
        .map((f) => taskChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const taskInactive = taskChoices.filter((c) => taskActive.indexOf(c) === -1)

    const onTaskChange = debounce(() => {
        settingsStore.update(state => {
            state.layout.homeTasks = taskActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<div class="settings-block">
    <h2>Tasks</h2>

    <p>
        <code>[Holiday]</code> tasks will only show that column when that holiday is active.
        You'll also need to add <code>Tasks</code> to <code>Home columns</code> in
        <a href='#/settings/layout'>Settings->Layout</a>.
    </p>

    <MagicLists
        key='lockouts'
        onFunc={onTaskChange}
        active={taskActive}
        inactive={taskInactive}
    />
</div>

<div class="settings-block">
    <h3>Dragonflight Profession Weeklies</h3>

    <CheckboxInput
        bind:value={$settingsStore.tasks.dragonflightCountCraftingDrops}
        name="tasks_dragonflightCountCraftingDrops"
    >
        Count incomplete crafting drops in Profession Weeklies.
    </CheckboxInput>

    <CheckboxInput
        bind:value={$settingsStore.tasks.dragonflightCountGathering}
        name="tasks_dragonflightCountGathering"
    >
        Count incomplete gathering tasks in Profession Weeklies.
    </CheckboxInput>

    <CheckboxInput
        bind:value={$settingsStore.tasks.dragonflightTreatises}
        name="tasks_dragonflightTreatises"
    >
        Show Treatises in Profession Weeklies.
    </CheckboxInput>
</div>

<div class="settings-block">
    <div>
        <h3>Dragonflight Chores</h3>
        {#if $settingsStore.layout.homeTasks.indexOf('dfChores') >= 0}
            <Multi multiTaskKey="dfChores" />
        {:else}
            <span>Add "<code>[DF]</code> Chores" to your Tasks list</span>
        {/if}
    </div>
</div>

<div class="settings-block">
    <div>
        <h3>Dragonflight Chores - 10.1.0</h3>
        {#if $settingsStore.layout.homeTasks.indexOf('dfChores10_1_0') >= 0}
            <Multi multiTaskKey="dfChores10_1_0" />
        {:else}
            <span>Add "<code>[DF]</code> Chores - 10.1.0" to your Tasks list</span>
        {/if}
    </div>
</div>

<div class="settings-block">
    <div>
        <h3>PvP Brawl</h3>
        {#if $settingsStore.layout.homeTasks.indexOf('pvpBrawl') >= 0}
            <Multi multiTaskKey="pvpBrawl" />
        {:else}
            <span>Add "<code>[PvP]</code> Brawl - Something Different" to your Tasks list</span>
        {/if}
    </div>
</div>
