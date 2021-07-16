<script lang="ts">
    import {Constants} from '@/data/constants'
    import {data as settingsData} from '@/stores/settings'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>General</h2>

    <CheckboxInput name="general_showClassIcon" label="Show class icon" bind:value={$settingsData.general.showClassIcon} />
    <CheckboxInput name="general_showRaceIcon" label="Show race icon" bind:value={$settingsData.general.showRaceIcon} />
    <CheckboxInput name="general_showSpecIcon" label="Show specialization icon" bind:value={$settingsData.general.showSpecIcon} />
    <CheckboxInput name="general_showItemLevel" label="Show item level" bind:value={$settingsData.general.showItemLevel} />
    <CheckboxInput name="general_showRealm" label="Show realm name" bind:value={$settingsData.general.showRealm} />
    <CheckboxInput name="general_useWowdb" label="Use WowDB for links" bind:value={$settingsData.general.useWowdb} />

    <fieldset>
        <label for="input-minimumLevel">Minimum level</label>
        <input id="input-minimumLevel" name="general_minimumLevel" type="number" min="1" max="{Constants.characterMaxLevel}" bind:value={$settingsData.general.minimumLevel}>
    </fieldset>
</div>
