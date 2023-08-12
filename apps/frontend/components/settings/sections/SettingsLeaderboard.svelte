<script lang="ts">
    import { settingsStore } from '@/stores'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    const accountLink = window.location.href.split('#')[0]
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
            bind:value={$settingsStore.leaderboard.anonymous}
        >Anonymous</Checkbox>
        <p>
            Hide your username on the leaderboard.
        </p>
    </div>
</div>
