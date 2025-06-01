<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Achievements</h2>

    <div class="setting">
        <Checkbox
            name="privacy_public"
            bind:value={settingsState.value.achievements.showCharactersIfCompleted}
            >Always show criteria</Checkbox
        >
        <p>Always show criteria and the list of characters even if the achievement is completed.</p>
    </div>
</div>
