<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { staticStore } from '@/shared/stores/static';
    import { settingsStore } from '@/shared/stores/settings';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import Collecting from './SettingsProfessionsCollecting.svelte';
    import Cooldowns from './SettingsProfessionsCooldowns.svelte';

    const sortedProfessions = sortBy(Object.values($staticStore.professions), (prof) => [
        prof.type,
        prof.name,
    ]);

    $settingsStore.professions.collectingCharacters ||= {};
</script>

<div>
    <Collecting {sortedProfessions} />

    <div class="settings-block">
        <h3>Profession Weeklies</h3>

        <CheckboxInput
            bind:value={$settingsStore.professions.dragonflightCountCraftingDrops}
            name="professions_dragonflightCountCraftingDrops"
        >
            Count incomplete crafting drops in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={$settingsStore.professions.dragonflightCountGathering}
            name="professions_dragonflightCountGathering"
        >
            Count incomplete gathering tasks in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={$settingsStore.professions.dragonflightCountTasks}
            name="professions_dragonflightCountTasks"
        >
            Count incomplete "Task" tasks in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={$settingsStore.professions.dragonflightTreatises}
            name="professions_dragonflightTreatises"
        >
            Show Treatises in Profession Weeklies.
        </CheckboxInput>

        <CheckboxInput
            bind:value={$settingsStore.professions.fullConcentrationIsBad}
            name="professions_fullConcentrationIsBad"
        >
            Full Concentration is a bad thing.
        </CheckboxInput>

        <CheckboxInput
            bind:value={$settingsStore.professions.ignoreTasksWhenDoneWithTraits}
            name="professions_ignoreTasksWhenDoneWithTraits"
        >
            Ignore tasks when character has 100% of traits.
        </CheckboxInput>
    </div>
</div>

<Cooldowns {sortedProfessions} />
