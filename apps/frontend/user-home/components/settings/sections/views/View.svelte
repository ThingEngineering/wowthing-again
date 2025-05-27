<script lang="ts">
    import { onMount } from 'svelte';

    import { settingsStore } from '@/shared/stores/settings';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import Currencies from './Currencies.svelte';
    import Grouping from './Grouping.svelte';
    import Items from './Items.svelte';
    import Lockouts from './Lockouts.svelte';
    import Sorting from './Sorting.svelte';
    import TableSettings from './TableSettings.svelte';
    import Tasks from './Tasks.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import TooltipCharacterFilter from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte';

    let { params }: { params: { viewId: string } } = $props();

    let view = $derived.by(() =>
        ($settingsStore.views || []).find((view) => view.id === params.viewId),
    );

    const onHomeFieldsUpdated = (e: Event) => {
        view.homeFields = (e as CustomEvent<string[]>).detail;
    };

    onMount(() => {
        document.addEventListener('homeFieldsUpdated', onHomeFieldsUpdated);
        return () => {
            document.removeEventListener('homeFieldsUpdated', onHomeFieldsUpdated);
        };
    });
</script>

<style lang="scss">
    .view-edit {
        width: 100%;

        :global(label) {
            flex-basis: 10rem;
        }
        :global(input) {
            background: $highlight-background;
        }
    }
</style>

{#if view}
    {#key `view--${view.id}`}
        <h2 class="text-overflow">Views &gt; {view.name}</h2>
        <div class="settings-block">
            <div class="view-edit" data-id={view.id}>
                <TextInput maxlength={32} name="view_name" label="Name" bind:value={view.name} />
            </div>
            <div class="view-edit" data-id={view.id}>
                <TextInput
                    name="view_characterFilter"
                    label="Character Filter"
                    tooltipComponent={{
                        component: TooltipCharacterFilter,
                        props: {},
                    }}
                    bind:value={view.characterFilter}
                />
            </div>
        </div>

        <div class="settings-block">
            <CheckboxInput name="group_before_pin" bind:value={view.groupBeforePin}>
                Group characters before pinning
            </CheckboxInput>

            <CheckboxInput
                name="show_completed_untracked_chores"
                bind:value={view.showCompletedUntrackedChores}
            >
                Show completed untracked chores
            </CheckboxInput>
        </div>

        <div class="settings-block settings-block-big">
            <Grouping bind:view />
            <Sorting bind:view />
        </div>

        <TableSettings bind:view />

        <Currencies active={view.homeFields.indexOf('currencies') >= 0} bind:view />
        <Items active={view.homeFields.indexOf('items') >= 0} bind:view />
        <Lockouts active={view.homeFields.indexOf('lockouts') >= 0} bind:view />
        <Tasks active={view.homeFields.indexOf('tasks') >= 0} bind:view />
    {/key}
{/if}
