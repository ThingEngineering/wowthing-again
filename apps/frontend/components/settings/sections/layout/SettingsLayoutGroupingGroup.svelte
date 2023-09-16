<script lang="ts">
    import type { SettingsCustomGroup } from '@/types'

    import TextInput from '@/components/forms/TextInput.svelte'
    import Tooltip from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte'

    export let group: SettingsCustomGroup
</script>

<style lang="scss">
    .group-edit {
        width: 20rem;

        :global(label) {
            flex-basis: 5rem;
        }
    }
</style>

{#if group}
    <div
        class="group-edit"
        data-id={group.id}
    >
        <div>
            <TextInput
                name="group_name"
                label={'Name'}
                bind:value={group.name}
            />
        </div>
        <div>
            <TextInput
                name="group_filter"
                label={'Filter'}
                bind:value={group.filter}
                tooltipComponent={{
                    component: Tooltip,
                    props: {},
                }}
            />
        </div>
    </div>
{/if}
