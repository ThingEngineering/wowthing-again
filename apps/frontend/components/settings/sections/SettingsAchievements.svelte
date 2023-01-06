<script lang="ts">
    import { settingsStore } from '@/stores'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Achievements</h2>

    <div class="setting">
        <Checkbox
            name="privacy_public"
            bind:value={$settingsStore.achievements.showCharactersIfCompleted}
        >Always show criteria</Checkbox>
        <p>
            Always show criteria and the list of characters even if the achievement is completed.
        </p>
    </div>
</div>
