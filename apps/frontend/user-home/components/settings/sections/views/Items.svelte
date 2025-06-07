<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let itemFilter = $state('');

    let itemChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (const itemId of view.homeItems) {
            const item = wowthingData.items.items[itemId];
            ret.push({
                id: item.id.toString(),
                name: item.name,
            });
        }

        const itemWords = (itemFilter?.toLocaleLowerCase()?.split(' ') || []).filter(
            (word) => word.length >= 3
        );
        if (itemWords.length > 0) {
            for (const item of Object.values(wowthingData.items.items)) {
                const lowerName = item.name.toLocaleLowerCase();
                if (
                    itemWords.every((word) => lowerName.indexOf(word) >= 0) &&
                    !view.homeItems.includes(item.id)
                ) {
                    ret.push({
                        id: item.id.toString(),
                        name: item.name,
                    });
                    if (ret.length === 100) {
                        break;
                    }
                }
            }
        }

        ret.sort((a, b) => a.name.localeCompare(b.name));
        return ret;
    });
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

        <MagicLists key="items" choices={itemChoices} bind:activeNumberIds={view.homeItems} />
    </div>
{/if}
