<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
</script>

<div class="settings-block">
    <h2>Collections</h2>

    <div class="setting">
        <Checkbox
            name="collections_hideFuture"
            bind:value={settingsState.value.collections.hideFuture}>Hide Future Expansions</Checkbox
        >
        <div>
            <p>Hide collectibles from future expansions.</p>
        </div>
    </div>

    <div class="setting">
        <Checkbox
            name="collections_hideUnavailable"
            bind:value={settingsState.value.collections.hideUnavailable}>Hide Unavailable</Checkbox
        >
        <div>
            <p>
                Hide unavailable collectibles that you have not already collected. Work in progress,
                only works in:
            </p>
            <ul>
                <li>Heirlooms</li>
                <li>Illusions</li>
                <li>Mounts</li>
                <li>Pets</li>
                <li>Toys</li>
            </ul>
        </div>
    </div>
</div>
