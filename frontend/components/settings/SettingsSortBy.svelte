<script lang="ts">
    import {data as settingsData} from '../../stores/settings'

    import TextInput from '@/components/forms/TextInput.svelte'

    let sortBy: string = $settingsData.general.sortBy.join(',')

    const inputSortBy = () => {
        $settingsData.general.sortBy = sortBy.split(',')
    }
</script>

<div class="thing-container settings-container">
    <h2>Sort By</h2>

    <TextInput name="general_sortBy" label="Sort by:" bind:value={sortBy} on:input={inputSortBy}>
        <p>Comma-separated list of things to sort characters by:</p>
        <ul>
            <li><pre>account</pre>: by account... name?</li>
            <li><pre>enabled</pre>: active accounts before inactive</li>
            <li><pre>faction</pre>: Alliance then Horde</li>
            <li><pre>-faction</pre>: Horde then Alliance</li>
            <li><pre>level</pre>: character level, descending</li>
            <li><pre>name</pre>: character name</li>
        </ul>
    </TextInput>
</div>
