<script lang="ts">
    import { itemStore } from '@/stores'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let active: boolean
    export let view: SettingsView

    let itemFilter: string

    let itemChoices: SettingsChoice[] = []
    $: {
        itemChoices = []

        for (const itemId of view.homeItems) {
            const item = $itemStore.items[itemId];
            itemChoices.push({
                id: item.id.toString(),
                name: item.name,
            })
        }
        
        const itemWords = (itemFilter?.toLocaleLowerCase()?.split(' ') || []).filter((word) => word.length >= 3)
        if (itemWords.length > 0) {
            for (const item of Object.values($itemStore.items)) {
                const lowerName = item.name.toLocaleLowerCase()
                if (itemWords.every((word) => lowerName.indexOf(word) >= 0) &&
                    !view.homeItems.includes(item.id)) {
                    itemChoices.push({
                        id: item.id.toString(),
                        name: item.name,
                    })
                    if (itemChoices.length === 100) {
                        break
                    }
                }
            }
        }

        itemChoices.sort((a, b) => a.name.localeCompare(b.name))
    }
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
                name="filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={itemFilter}
            />
        </div>
    
        <MagicLists
            key="items"
            choices={itemChoices}
            bind:activeNumberIds={view.homeItems}
        />
    </div>
{/if}
