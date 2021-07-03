<script lang="ts">
    import {data as settingsData} from '@/stores/settings'
    import Checkbox from '@/components/forms/Checkbox.svelte'
</script>

<style lang="scss">
    .thing-container {
        border: 1px solid $border-color;
    }
</style>

<div class="thing-container settings-container">
    <h2>General</h2>

    <ul>
        <li>
            <Checkbox name="showClassIcon" label="Show class icon" bind:value={$settingsData.general.showClassIcon} />
        </li>
        <li>
            <Checkbox name="showRaceIcon" label="Show race icon" bind:value={$settingsData.general.showRaceIcon} />
        </li>
        <li>
            <Checkbox name="showSpecIcon" label="Show specialization icon" bind:value={$settingsData.general.showSpecIcon} />
        </li>
        <li>
            <Checkbox name="showItemLevel" label="Show item level" bind:value={$settingsData.general.showItemLevel} />
        </li>
        <li>
            <Checkbox name="showRealm" label="Show realm name" bind:value={$settingsData.general.showRealm} />
        </li>
    </ul>
</div>
