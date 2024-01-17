<script lang="ts">
    import debounce from 'lodash/debounce'
    import every from 'lodash/every'
    import some from 'lodash/some'

    import { itemStore } from '@/stores'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let active: boolean
    export let view: SettingsView

    let itemFilter: string

    let itemChoices: SettingsChoice[]
    $: {
        itemChoices = []
        
        const itemWords = (itemFilter?.toLocaleLowerCase()?.split(' ') || []).filter((word) => word.length >= 3)
        if (itemWords.length > 0) {
            for (const item of Object.values($itemStore.items)) {
                const lowerName = item.name.toLocaleLowerCase()
                if (every(itemWords, (word) => lowerName.indexOf(word) >= 0)) {
                    itemChoices.push(item)
                    if (itemChoices.length === 50) {
                        break
                    }
                }
            }
        }

        itemChoices.sort((a, b) => a.name.localeCompare(b.name))
    }

    $: itemsActive = view.homeItems.map((active) => $itemStore.items[active])
    
    $: itemsInactive = itemChoices.filter((item) => !some(itemsActive, (active) => active.key === item.key))

    const onItemsChange = debounce(() => {
        view.homeItems = itemsActive.map((item) => parseInt(item.key))
    }, 100)
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 11.4rem;
        --magic-max-height: 11.4rem;
    }
    .filter-items {
        position: relative;

        :global(fieldset) {
            background: $highlight-background;
            bottom: -2.6rem;
            position: absolute;
            right: -4px;
            width: 12rem;
        }
    }
</style>

<div class="settings-block">
    <h3>
        Items
        {#if !active}
            <span>add to Home columns to configure</span>
        {/if}
    </h3>

    {#if active}
        <div class="filter-items">
            <TextInput
                name="filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={itemFilter}
            />
        </div>

        <MagicLists
            key="items"
            title="Items"
            onFunc={onItemsChange}
            active={itemsActive}
            inactive={itemsInactive}
        />
    {/if}
</div>
