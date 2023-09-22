<script lang="ts">
    import type { SettingsCustomGroup } from '@/types'

    import TextInput from '@/components/forms/TextInput.svelte'
    import Tooltip from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte'

    export let group: SettingsCustomGroup
</script>

<style lang="scss">
    .group-edit {
        width: 30rem;

        :global(label) {
            flex-basis: 5rem;
        }
    }
    .description {
        margin-left: 4.2rem;

        p {
            margin: 0.5rem 0;
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
        <div class="description">
            <p>Combine terms with AND/OR and parentheses, eg:</p>
            <code>alliance AND level=70 AND (tank OR healer)</code>
        </div>
</div>
{/if}
