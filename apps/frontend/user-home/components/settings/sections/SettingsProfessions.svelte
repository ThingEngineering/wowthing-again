<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns'
    import { staticStore } from '@/shared/stores/static'
    import { settingsStore } from '@/shared/stores/settings'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import Collecting from './SettingsProfessionsCollecting.svelte'
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte'

    const groupedCooldowns = groupBy(
        [...professionWorkOrders, ...professionCooldowns],
        (cd) => cd.profession
    )
    const sortedProfessions = sortBy(
        Object.values($staticStore.professions),
        (prof) => [prof.type, prof.name]
    )

    $: $settingsStore.professions.collectingCharacters ||= {}
</script>

<style lang="scss">
    .many-boxes {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        display: flex;
        flex-wrap: wrap;
        gap: 0 1rem;

        :global(fieldset) {
            min-width: 0;
            width: 14rem;
        }

        + .many-boxes {
            border-top: 1px dotted $border-color;
        }
    }
</style>

<Collecting {sortedProfessions} />

<div class="settings-block">
    <h3>Cooldowns</h3>

    {#each sortedProfessions as profession}
        {#if groupedCooldowns[profession.id]}
            <div class="many-boxes">
                {#each groupedCooldowns[profession.id] as cooldown}
                    <CheckboxInput
                        name="professions_{cooldown.key}"
                        bind:value={$settingsStore.professions.cooldowns[cooldown.key]}
                    >
                        <ProfessionIcon id={cooldown.profession} border={1} />
                        {cooldown.name.replace('[DF] ', '')}
                    </CheckboxInput>
                {/each}
            </div>
        {/if}
    {/each}
</div>

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
        bind:value={$settingsStore.professions.ignoreTasksWhenDoneWithTraits}
        name="professions_ignoreTasksWhenDoneWithTraits"
    >
        Ignore tasks when character has 100% of traits.
    </CheckboxInput>
</div>
