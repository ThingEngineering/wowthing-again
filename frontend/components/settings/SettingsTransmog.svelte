<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Transmog</h2>

    <CheckboxInput name="transmog_showDeathKnight" label="Show Death Knight" bind:value={$settingsData.transmog.showDeathKnight} />
    <CheckboxInput name="transmog_showDemonHunter" label="Show Demon Hunter" bind:value={$settingsData.transmog.showDemonHunter} />
    <CheckboxInput name="transmog_showDruid" label="Show Druid" bind:value={$settingsData.transmog.showDruid} />
    <CheckboxInput name="transmog_showHunter" label="Show Hunter" bind:value={$settingsData.transmog.showHunter} />
    <CheckboxInput name="transmog_showMage" label="Show Mage" bind:value={$settingsData.transmog.showMage} />
    <CheckboxInput name="transmog_showMonk" label="Show Monk" bind:value={$settingsData.transmog.showMonk} />
    <CheckboxInput name="transmog_showPaladin" label="Show Paladin" bind:value={$settingsData.transmog.showPaladin} />
    <CheckboxInput name="transmog_showPriest" label="Show Priest" bind:value={$settingsData.transmog.showPriest} />
    <CheckboxInput name="transmog_showRogue" label="Show Rogue" bind:value={$settingsData.transmog.showRogue} />
    <CheckboxInput name="transmog_showShaman" label="Show Shaman" bind:value={$settingsData.transmog.showShaman} />
    <CheckboxInput name="transmog_showWarlock" label="Show Warlock" bind:value={$settingsData.transmog.showWarlock} />
    <CheckboxInput name="transmog_showWarrior" label="Show Warrior" bind:value={$settingsData.transmog.showWarrior} />
</div>
