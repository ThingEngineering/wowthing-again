<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let itemFilter = $state('');

    const sortedItems = sortBy(
        Object.values(wowthingData.items.items).map(
            (item) =>
                ({
                    id: item.id.toString(),
                    name: item.name,
                }) as SettingsChoice
        ),
        (item) => item.name
    );
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

{#if active}
    <div class="settings-block">
        <h3>Items</h3>

        <div class="magic-filter">
            <TextInput
                name="items_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={itemFilter}
            />
        </div>

        <MagicLists
            key="items"
            choices={sortedItems}
            filter={itemFilter}
            bind:activeNumberIds={view.homeItems}
        />
    </div>
{/if}
