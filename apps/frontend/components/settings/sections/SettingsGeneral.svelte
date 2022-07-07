<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import NumberInput from '@/components/forms/NumberInput.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>General</h2>

    <NumberInput name="general_refreshInterval" label="Auto-refresh interval" minValue={0} maxValue={1440} bind:value={$settingsData.general.refreshInterval}>
        <p>Minutes between automatically reloading your data from the server, 0 to disable</p>
    </NumberInput>
</div>
