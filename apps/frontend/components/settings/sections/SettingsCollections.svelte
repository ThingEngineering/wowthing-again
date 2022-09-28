<script lang="ts">
    import { data as settingsData } from '@/stores/settings'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
</script>

<div class="thing-container settings-container">
    <h2>Collections</h2>

    <div class="setting">
        <Checkbox
            name="collections_hideUnavailable"
            bind:value={$settingsData.collections.hideUnavailable}
        >Hide Unavailable</Checkbox>
        <p>Stuff
        </p>
    </div>
</div>
