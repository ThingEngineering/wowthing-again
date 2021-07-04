<script lang="ts">
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
    </ul>
</div>
