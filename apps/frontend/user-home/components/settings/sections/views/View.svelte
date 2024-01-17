<script lang="ts">
    import find from 'lodash/find'
    import { onMount } from 'svelte'

    import { settingsStore } from '@/shared/stores/settings'

    import TooltipCharacterFilter from '@/components/tooltips/character-filter/TooltipCharacterFilter.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    import TableSettings from './TableSettings.svelte'
    import Currencies from './Currencies.svelte'
    import Grouping from './Grouping.svelte'
    import Items from './Items.svelte'
    import Lockouts from './Lockouts.svelte'
    import Sorting from './Sorting.svelte'
    import Tasks from './Tasks.svelte'

    export let params: { view: string }

    $: view = find($settingsStore.views || [], (view) => view.id === params.view)
    $: homeFields = view.homeFields

    const onHomeFieldsUpdated = (e) => {
        console.log(homeFields = e.detail)
    }

    onMount(() => {
        document.addEventListener('homeFieldsUpdated', onHomeFieldsUpdated)
        return () => { document.removeEventListener('homeFieldsUpdated', onHomeFieldsUpdated) }
    })
</script>

<style lang="scss">
    .view-edit {
        width: 100%;

        :global(label) {
            flex-basis: 10rem;
        }
    }
</style>

{#if view}
    <div class="settings-block">
        <h2 class="text-overflow">Views &gt; {view.name}</h2>
        <div
            class="view-edit"
            data-id={view.id}
        >
            <TextInput
                maxlength={32}
                name="view_name"
                label={'Name'}
                bind:value={view.name}
            />
        </div>
        <div
            class="view-edit"
            data-id={view.id}
        >
            <TextInput
                name="view_characterFilter"
                label={'Character Filter'}
                tooltipComponent={{
                    component: TooltipCharacterFilter,
                    props: {},
                }}
                bind:value={view.characterFilter}
            />
        </div>
    </div>

    {#key `view--${view.id}`}
        <Grouping {view} />
        <Sorting {view} />
        <TableSettings {view} />

        <Lockouts
            active={homeFields.indexOf('lockouts') >= 0}
            {view}
        />
        <Tasks
            active={homeFields.indexOf('tasks') >= 0}
            {view}
        />
        <Currencies
            active={homeFields.indexOf('currencies') >= 0}
            {view}
        />
        <Items
            active={homeFields.indexOf('items') >= 0}
            {view}
        />
    {/key}
{/if}
