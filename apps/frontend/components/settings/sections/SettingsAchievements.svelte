<script lang="ts">
    import { settingsStore } from '@/user-home/stores/settings'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="settings-block">
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
