<script lang="ts">
    import { settingsStore } from '@/stores'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import ProfessionIcon from '@/components/images/ProfessionIcon.svelte'
    import { Profession } from '@/enums';
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
    <h3>Show Work Orders</h3>

    <div class="many-boxes">
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowAlchemy}
            name="professions_ordersShowAlchemy"
        >
            <ProfessionIcon id={Profession.Alchemy} border={1} /> Alchemy
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowBlacksmithing}
            name="professions_ordersShowBlacksmithing"
        >
            <ProfessionIcon id={Profession.Blacksmithing} border={1} /> Blacksmithing
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowEnchanting}
            name="professions_ordersShowEnchanting"
        >
            <ProfessionIcon id={Profession.Enchanting} border={1} /> Enchanting
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowEngineering}
            name="professions_ordersShowEngineering"
        >
            <ProfessionIcon id={Profession.Engineering} border={1} /> Engineering
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowInscription}
            name="professions_ordersShowInscription"
        >
            <ProfessionIcon id={Profession.Inscription} border={1} /> Inscription
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowJewelcrafting}
            name="professions_ordersShowJewelcrafting"
        >
            <ProfessionIcon id={Profession.Jewelcrafting} border={1} /> Jewelcrafting
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowLeatherworking}
            name="professions_ordersShowLeatherworking"
        >
            <ProfessionIcon id={Profession.Leatherworking} border={1} /> Leatherworking
        </CheckboxInput>
        <CheckboxInput
            bind:value={$settingsStore.professions.ordersShowTailoring}
            name="professions_ordersShowTailoring"
        >
            <ProfessionIcon id={Profession.Tailoring} border={1} /> Tailoring
        </CheckboxInput>
    </div>
</div>
