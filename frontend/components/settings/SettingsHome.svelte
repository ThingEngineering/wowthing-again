<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Home</h2>

        <CheckboxInput name="home_showCovenant" label="Show covenant and renown" bind:value={$settingsData.home.showCovenant} />
        <CheckboxInput name="home_showKeystone" label="Show Mythic+ keystone" bind:value={$settingsData.home.showKeystone} />
        <CheckboxInput name="home_showMountSpeed" label="Show mount speed" bind:value={$settingsData.home.showMountSpeed} />
        <CheckboxInput name="home_showTorghast" label="Show Torghast completion" bind:value={$settingsData.home.showTorghast} />
        <CheckboxInput name="home_showVaultMythicPlus" label="Show vault - Mythic+" bind:value={$settingsData.home.showVaultMythicPlus} />
        <CheckboxInput name="home_showVaultPvp" label="Show vault - PvP" bind:value={$settingsData.home.showVaultPvp} />
        <CheckboxInput name="home_showVaultRaid" label="Show vault - Raid" bind:value={$settingsData.home.showVaultRaid} />
        <CheckboxInput name="home_showWeeklyAnima" label="Show weekly - Anima" bind:value={$settingsData.home.showWeeklyAnima} />
        <CheckboxInput name="home_showWeeklyShapingFate" label="Show weekly - Shaping Fate" bind:value={$settingsData.home.showWeeklyShapingFate} />
        <CheckboxInput name="home_showWeeklySouls" label="Show weekly - Souls" bind:value={$settingsData.home.showWeeklySouls} />
</div>
