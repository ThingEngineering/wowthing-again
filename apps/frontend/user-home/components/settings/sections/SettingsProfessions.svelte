<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import Collecting from './SettingsProfessionsCollecting.svelte';
    import Cooldowns from './SettingsProfessionsCooldowns.svelte';

    const sortedProfessions = sortBy(
        Array.from(wowthingData.static.professionById.values()),
        (prof) => [prof.type, prof.name]
    );
</script>

<div>
    <Collecting {sortedProfessions} />

    <div class="settings-block">
        <h3>Profession Weeklies</h3>

        <CheckboxInput
            bind:value={settingsState.value.professions.dragonflightCountCraftingDrops}
            name="professions_dragonflightCountCraftingDrops"
        >
            Count incomplete crafting drops in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={settingsState.value.professions.dragonflightCountGathering}
            name="professions_dragonflightCountGathering"
        >
            Count incomplete gathering tasks in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={settingsState.value.professions.dragonflightCountTasks}
            name="professions_dragonflightCountTasks"
        >
            Count incomplete "Task" tasks in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={settingsState.value.professions.dragonflightTreatises}
            name="professions_dragonflightTreatises"
        >
            Show Treatises in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={settingsState.value.professions.fullConcentrationIsBad}
            name="professions_fullConcentrationIsBad"
        >
            Full Concentration is a bad thing.
        </CheckboxInput>

        <CheckboxInput
            bind:value={settingsState.value.professions.ignoreTasksWhenDoneWithTraits}
            name="professions_ignoreTasksWhenDoneWithTraits"
        >
            Ignore tasks when character has 100% of traits.
        </CheckboxInput>
    </div>
</div>

<Cooldowns {sortedProfessions} />
