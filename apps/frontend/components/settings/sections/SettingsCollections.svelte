<script lang="ts">
    import { settingsStore } from '@/stores'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
</script>

<div class="thing-container settings-container">
    <h2>Collections</h2>

    <div class="setting">
        <Checkbox
            name="collections_hideUnavailable"
            bind:value={$settingsStore.collections.hideUnavailable}
        >Hide Unavailable</Checkbox>
        <div>
            <p>
                Hide unavailable collectibles that you have not already collected. Work in progress, only works in:
            </p>
            <ul>
                <li>Mounts</li>
                <li>Pets</li>
                <li>Toys</li>
                <li>Sets V2</li>
            </ul>
        </div>
    </div>
</div>
