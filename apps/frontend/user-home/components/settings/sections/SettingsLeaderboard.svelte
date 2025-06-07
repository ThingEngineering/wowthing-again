<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Leaderboard</h2>

    <div class="setting">
        <Checkbox name="leaderboard_enabled" bind:value={settingsState.value.leaderboard.enabled}
            >Enabled</Checkbox
        >
        <p>Is the Leaderboard enabled for your account?</p>
    </div>

    <div class="setting">
        <Checkbox
            name="leaderboard_anonymous"
            disabled={!settingsState.value.leaderboard.enabled}
            bind:value={settingsState.value.leaderboard.anonymous}>Anonymous</Checkbox
        >
        <p>Hide your username on the leaderboard.</p>
    </div>
</div>
