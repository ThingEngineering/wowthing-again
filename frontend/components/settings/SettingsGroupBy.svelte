<script lang="ts">
    import {data as settingsData} from '../../stores/settings'

    import TextInput from '@/components/forms/TextInput.svelte'

    let groupBy: string = $settingsData.general.groupBy.join(',')

    const inputGroupBy = () => {
        $settingsData.general.groupBy = groupBy.split(',')
    }
</script>

<div class="thing-container settings-container">
    <h2>Group By</h2>

    <TextInput name="general_groupBy" label="Group by:" bind:value={groupBy} on:input={inputGroupBy}>
        <p>Comma-separated list of things to group characters by:</p>
        <ul>
            <li><pre>account</pre>: by account... name?</li>
            <li><pre>enabled</pre>: by account active/inactive status</li>
            <li><pre>faction</pre>: by faction</li>
            <li><pre>maxLevel</pre>: maximum level vs everyone else</li>
        </ul>
    </TextInput>
</div>
