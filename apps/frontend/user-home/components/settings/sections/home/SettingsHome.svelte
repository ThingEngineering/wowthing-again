<script lang="ts">
    import { viewSwitcherChoices } from '@/data/settings';
    import { taskList } from '@/data/tasks';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import type { SettingsChoice } from '@/shared/stores/settings/types/choice';

    import MagicLists from '@/user-home/components/settings/MagicLists.svelte';
    import Select from '@/shared/components/forms/Select.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    const regionStrings: Record<number, string> = {
        [Region.US]: '[US] Americas & Oceania',
        [Region.EU]: '[EU] Europe',
        [Region.KR]: '[KR] Korea',
        [Region.TW]: '[TW] Taiwan',
    };

    let taskFilter = $state('');

    let taskChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (const customTask of settingsState.value.customTasks || []) {
            ret.push({ id: customTask.key, name: `[Custom] ${customTask.name}` });
        }

        for (const task of taskList) {
            // ret.push({ id: task.key, name: task.name });
            if (task.showSeparate) {
                for (const chore of task.chores.filter((c) => !!c)) {
                    if (chore.accountWide) {
                        ret.push({
                            id: `${task.key}|${chore.key}`,
                            name: `${task.name} - ${chore.name}`,
                        });
                    }
                }
            }
        }

        return ret;
    });
</script>

<div class="settings-block">
    <h3>Holidays Region</h3>

    <div class="setting">
        <Select
            name="home_holiday_region"
            options={userState.general.allRegions.map((region) => [region, regionStrings[region]])}
            bind:selected={settingsState.value.general.holidayRegion}
        />
        <p>
            Region to use for holiday start/end times. If you only have accounts in a single region
            you shouldn't need to change this.
        </p>
    </div>

    <h3>View Switcher</h3>

    <MagicLists
        key="view-switcher"
        choices={viewSwitcherChoices}
        bind:activeStringIds={settingsState.value.layout.homeViewSwitcher}
    />
</div>

{#if settingsState.value.layout.homeViewSwitcher.includes('tasks')}
    <div class="settings-block">
        <h3>Tasks</h3>

        <div class="magic-filter">
            <TextInput
                name="tasks_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={taskFilter}
            />
        </div>

        <MagicLists
            key="tasks"
            choices={taskChoices}
            filter={taskFilter}
            bind:activeStringIds={settingsState.value.layout.homeTasksV2}
        />
    </div>
{/if}
