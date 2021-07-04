<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import Checkbox from '@/components/forms/Checkbox.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Home</h2>

    <ul>
        <li>
            <Checkbox name="home_showCovenant" label="Show covenant and renown" bind:value={$settingsData.home.showCovenant} />
        </li>
        <li>
            <Checkbox name="home_showKeystone" label="Show Mythic+ keystone" bind:value={$settingsData.home.showKeystone} />
        </li>
        <li>
            <Checkbox name="home_showMountSpeed" label="Show mount speed" bind:value={$settingsData.home.showMountSpeed} />
        </li>
        <li>
            <Checkbox name="home_showTorghast" label="Show Torghast completion" bind:value={$settingsData.home.showTorghast} />
        </li>
        <li>
            <Checkbox name="home_showVaultMythicPlus" label="Show vault - Mythic+" bind:value={$settingsData.home.showVaultMythicPlus} />
        </li>
        <li>
            <Checkbox name="home_showVaultPvp" label="Show vault - PvP" bind:value={$settingsData.home.showVaultPvp} />
        </li>
        <li>
            <Checkbox name="home_showVaultRaid" label="Show vault - Raid" bind:value={$settingsData.home.showVaultRaid} />
        </li>
        <li>
            <Checkbox name="home_showWeeklyAnima" label="Show weekly - Anima" bind:value={$settingsData.home.showWeeklyAnima} />
        </li>
        <li>
            <Checkbox name="home_showWeeklyShapingFate" label="Show weekly - Shaping Fate" bind:value={$settingsData.home.showWeeklyShapingFate} />
        </li>
        <li>
            <Checkbox name="home_showWeeklySouls" label="Show weekly - Souls" bind:value={$settingsData.home.showWeeklySouls} />
        </li>
    </ul>
</div>
