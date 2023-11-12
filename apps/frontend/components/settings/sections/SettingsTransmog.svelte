<script lang="ts">
    import { settingsStore } from '@/user-home/stores/settings'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
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
            bind:value={$settingsStore.transmog.completionistMode}
        >Completionist Mode</Checkbox>
        <p>
            <strong class="status-shrug">WARNING!</strong>
            This will only treat a transmog item appearance as collected if you have collected
            that exact source, not any other item that shares the same appearance.
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="transmog_completionistSets"
            disabled={!$settingsStore.transmog.completionistMode}
            bind:value={$settingsStore.transmog.completionistSets}
        >Completionist Sets</Checkbox>
        <p>
            Sets will require you to collect every appearance for every slot.
        </p>
    </div>
</div>

<div class="settings-block">
    <h3>Item Filters</h3>

    <div class="transmog-type">
        <h4>Cloth</h4>

        <Checkbox
            name="transmog_showMage"
            bind:value={$settingsStore.transmog.showMage}
            textClass="class-mage"
        >Mage</Checkbox>

        <Checkbox
            name="transmog_showPriest"
            bind:value={$settingsStore.transmog.showPriest}
            textClass="class-priest"
        >Priest</Checkbox>

        <Checkbox
            name="transmog_showWarlock"
            bind:value={$settingsStore.transmog.showWarlock}
            textClass="class-warlock"
        >Warlock</Checkbox>
    </div>

    <div class="transmog-type">
        <h4>Leather</h4>

        <Checkbox
            name="transmog_showDemonHunter"
            bind:value={$settingsStore.transmog.showDemonHunter}
            textClass="class-demon-hunter"
        >Demon Hunter</Checkbox>
        <Checkbox
            name="transmog_showDruid"
            bind:value={$settingsStore.transmog.showDruid}
            textClass="class-druid"
        >Druid</Checkbox>
        <Checkbox
            name="transmog_showMonk"
            bind:value={$settingsStore.transmog.showMonk}
            textClass="class-monk"
        >Monk</Checkbox>
        <Checkbox
            name="transmog_showRogue"
            bind:value={$settingsStore.transmog.showRogue}
            textClass="class-rogue"
        >Rogue</Checkbox>
    </div>

    <div class="transmog-type">
        <h4>Mail</h4>

        <Checkbox
            name="transmog_showEvoker"
            bind:value={$settingsStore.transmog.showEvoker}
            textClass="class-evoker"
        >Evoker</Checkbox>
        <Checkbox
            name="transmog_showHunter"
            bind:value={$settingsStore.transmog.showHunter}
            textClass="class-hunter"
        >Hunter</Checkbox>
        <Checkbox
            name="transmog_showShaman"
            bind:value={$settingsStore.transmog.showShaman}
            textClass="class-shaman"
        >Shaman</Checkbox>
    </div>

    <div class="transmog-type">
        <h4>Plate</h4>

        <Checkbox
            name="transmog_showDeathKnight"
            bind:value={$settingsStore.transmog.showDeathKnight}
            textClass="class-death-knight"
        >Death Knight</Checkbox>
        <Checkbox
            name="transmog_showPaladin"
            bind:value={$settingsStore.transmog.showPaladin}
            textClass="class-paladin"
        >Paladin</Checkbox>
        <Checkbox
            name="transmog_showWarrior"
            bind:value={$settingsStore.transmog.showWarrior}
            textClass="class-warrior"
        >Warrior</Checkbox>
    </div>

    <div class="separator"></div>

    <div class="transmog-type">
        <h4>Faction</h4>

        <Checkbox
            name="transmog_showAllianceOnly"
            bind:value={$settingsStore.transmog.showAllianceOnly}
            textClass="faction-alliance"
        >Alliance only</Checkbox>

        <Checkbox
            name="transmog_showHordeOnly"
            bind:value={$settingsStore.transmog.showHordeOnly}
            textClass="faction-horde"
        >Horde only</Checkbox>
    </div>
</div>
