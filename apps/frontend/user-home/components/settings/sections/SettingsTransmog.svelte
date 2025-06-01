<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<style lang="scss">
    .transmog-type {
        h4 {
            display: inline-block;
            transform: translateY(-1px);
            width: 5rem;
        }

        :global(fieldset) {
            display: inline-block;
            width: 9rem;
        }
    }
    .separator {
        border-top: 1px dashed $border-color;
        margin-bottom: 0.25rem;
    }
</style>

<div class="settings-block">
    <h3>Misc settings</h3>

    <div class="setting">
        <Checkbox
            name="transmog_completionistMode"
            bind:value={settingsState.value.transmog.completionistMode}>Completionist Mode</Checkbox
        >
        <p>
            <strong class="status-shrug">WARNING!</strong>
            This will only treat a transmog item appearance as collected if you have collected that exact
            source, not any other item that shares the same appearance.
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="transmog_completionistSets"
            disabled={!settingsState.value.transmog.completionistMode}
            bind:value={settingsState.value.transmog.completionistSets}>Completionist Sets</Checkbox
        >
        <p>Sets will require you to collect every appearance for every slot.</p>
    </div>
</div>

<div class="settings-block">
    <h3>Item Filters</h3>

    <div class="transmog-type">
        <h4>Cloth</h4>

        <Checkbox
            name="transmog_showMage"
            bind:value={settingsState.value.transmog.showMage}
            textClass="class-mage">Mage</Checkbox
        >

        <Checkbox
            name="transmog_showPriest"
            bind:value={settingsState.value.transmog.showPriest}
            textClass="class-priest">Priest</Checkbox
        >

        <Checkbox
            name="transmog_showWarlock"
            bind:value={settingsState.value.transmog.showWarlock}
            textClass="class-warlock">Warlock</Checkbox
        >
    </div>

    <div class="transmog-type">
        <h4>Leather</h4>

        <Checkbox
            name="transmog_showDemonHunter"
            bind:value={settingsState.value.transmog.showDemonHunter}
            textClass="class-demon-hunter">Demon Hunter</Checkbox
        >
        <Checkbox
            name="transmog_showDruid"
            bind:value={settingsState.value.transmog.showDruid}
            textClass="class-druid">Druid</Checkbox
        >
        <Checkbox
            name="transmog_showMonk"
            bind:value={settingsState.value.transmog.showMonk}
            textClass="class-monk">Monk</Checkbox
        >
        <Checkbox
            name="transmog_showRogue"
            bind:value={settingsState.value.transmog.showRogue}
            textClass="class-rogue">Rogue</Checkbox
        >
    </div>

    <div class="transmog-type">
        <h4>Mail</h4>

        <Checkbox
            name="transmog_showEvoker"
            bind:value={settingsState.value.transmog.showEvoker}
            textClass="class-evoker">Evoker</Checkbox
        >
        <Checkbox
            name="transmog_showHunter"
            bind:value={settingsState.value.transmog.showHunter}
            textClass="class-hunter">Hunter</Checkbox
        >
        <Checkbox
            name="transmog_showShaman"
            bind:value={settingsState.value.transmog.showShaman}
            textClass="class-shaman">Shaman</Checkbox
        >
    </div>

    <div class="transmog-type">
        <h4>Plate</h4>

        <Checkbox
            name="transmog_showDeathKnight"
            bind:value={settingsState.value.transmog.showDeathKnight}
            textClass="class-death-knight">Death Knight</Checkbox
        >
        <Checkbox
            name="transmog_showPaladin"
            bind:value={settingsState.value.transmog.showPaladin}
            textClass="class-paladin">Paladin</Checkbox
        >
        <Checkbox
            name="transmog_showWarrior"
            bind:value={settingsState.value.transmog.showWarrior}
            textClass="class-warrior">Warrior</Checkbox
        >
    </div>

    <div class="separator"></div>

    <div class="transmog-type">
        <h4>Faction</h4>

        <Checkbox
            name="transmog_showAllianceOnly"
            bind:value={settingsState.value.transmog.showAllianceOnly}
            textClass="faction-alliance">Alliance only</Checkbox
        >

        <Checkbox
            name="transmog_showHordeOnly"
            bind:value={settingsState.value.transmog.showHordeOnly}
            textClass="faction-horde">Horde only</Checkbox
        >
    </div>
</div>
