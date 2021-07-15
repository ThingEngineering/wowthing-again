<script lang="ts">
    import {Constants} from '@/data/constants'
    import {data as settingsData} from '@/stores/settings'

    import Checkbox from '@/components/forms/Checkbox.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>General</h2>

    <ul>
        <li>
            <Checkbox name="general_showClassIcon" label="Show class icon" bind:value={$settingsData.general.showClassIcon} />
        </li>
        <li>
            <Checkbox name="general_showRaceIcon" label="Show race icon" bind:value={$settingsData.general.showRaceIcon} />
        </li>
        <li>
            <Checkbox name="general_showSpecIcon" label="Show specialization icon" bind:value={$settingsData.general.showSpecIcon} />
        </li>
        <li>
            <Checkbox name="general_showItemLevel" label="Show item level" bind:value={$settingsData.general.showItemLevel} />
        </li>
        <li>
            <Checkbox name="general_showRealm" label="Show realm name" bind:value={$settingsData.general.showRealm} />
        </li>
        <li>
            <Checkbox name="general_useWowdb" label="Use WowDB links instead of Wowhead" bind:value={$settingsData.general.useWowdb} />
        </li>
        <li>
            <fieldset>
                <label for="input-minimumLevel">Minimum level</label>
                <input id="input-minimumLevel" name="general_minimumLevel" type="number" min="1" max="{Constants.characterMaxLevel}" bind:value={$settingsData.general.minimumLevel}>
            </fieldset>
        </li>
    </ul>
</div>
