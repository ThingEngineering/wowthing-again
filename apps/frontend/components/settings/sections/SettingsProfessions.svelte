<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import { professionCooldowns } from '@/data/professions/cooldowns'
    import { settingsStore } from '@/stores'
    import { staticStore } from '@/stores/static'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte'

    const groupedCooldowns = groupBy(professionCooldowns, (cd) => cd.profession)
    const sortedProfessions = sortBy(
        Object.values($staticStore.professions),
        (prof) => [prof.type, prof.name]
    )
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

<div class="settings-block">
    <h3>Dragonflight Profession Weeklies</h3>

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
        bind:value={$settingsStore.professions.dragonflightTreatises}
        name="professions_dragonflightTreatises"
    >
        Show Treatises in Profession Weeklies.
    </CheckboxInput>
</div>

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
