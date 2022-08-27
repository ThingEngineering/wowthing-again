<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    const accountLink = window.location.href.split('#')[0]
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Achievements</h2>

    <div class="setting">
        <Checkbox
            name="privacy_public"
            bind:value={$settingsData.achievements.showCharactersIfCompleted}
        >Always show criteria</Checkbox>
        <p>
            Always show criteria and the list of characters even if the achievement is completed.
        </p>
    </div>
</div>
