<script lang="ts">
    import type { SettingsView } from '@/shared/stores/settings/types'

    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let view: SettingsView
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
{/if}
