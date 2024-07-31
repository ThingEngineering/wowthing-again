<script lang="ts">
    import { settingsStore } from '@/shared/stores/settings'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Leaderboard</h2>

    <div class="setting">
        <Checkbox
            name="leaderboard_enabled"
            bind:value={$settingsStore.leaderboard.enabled}
        >Enabled</Checkbox>
        <p>
            Is the Leaderboard enabled for your account?
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="leaderboard_anonymous"
            disabled={!$settingsStore.leaderboard.enabled}
            bind:value={$settingsStore.leaderboard.anonymous}
        >Anonymous</Checkbox>
        <p>
            Hide your username on the leaderboard.
        </p>
    </div>
</div>
