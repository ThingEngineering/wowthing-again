<script lang="ts">
    import find from 'lodash/find'

    import { settingsStore } from '@/shared/stores/settings'

    import CharacterTableSettings from './CharacterTableSettings.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte'
    import Tasks from './Tasks.svelte';

    export let params: { view: string }

    $: view = find($settingsStore.views || [], (view) => view.id === params.view)
</script>

<style lang="scss">
    .view-edit {
        width: 20rem;

        :global(label) {
            flex-basis: 5rem;
        }
    }
</style>

{#if view}
    <div class="settings-block">
        <h2>Views &gt; {view.name}</h2>
        <div
            class="view-edit"
            data-id={view.id}
        >
            <div>
                <TextInput
                    name="view_name"
                    label={'Name'}
                    bind:value={view.name}
                />
            </div>
        </div>
    </div>

    {#key `view--${view.id}`}
        <CharacterTableSettings {view} />
        <Tasks {view} />
    {/key}
{/if}
