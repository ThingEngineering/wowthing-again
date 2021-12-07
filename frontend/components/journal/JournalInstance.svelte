<script lang="ts">
    import find from 'lodash/find'

    import { journalStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import getFilteredItems from '@/utils/journal/get-filtered-items'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import Item from './JournalItem.svelte'

    export let slug1: string
    export let slug2: string

    let instance: JournalDataInstance
    $: {
        const tier: JournalDataTier = find($journalStore.data.tiers, (tier) => tier.slug === slug1)
        if (tier) {
            instance = find(tier.instances, (instance) => instance.slug === slug2)
        }
    }
</script>

<style lang="scss">
    button {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
    }
    .collection {
        width: 100%;
    }
    .toggles {
        margin-bottom: calc(0.75rem - 1px);
    }
    .instance {
        border: 1px solid $border-color;
        width: 100%;
    }
    .counts {
        font-size: 1rem;
        font-weight: normal;
        margin-left: 0.5rem;
    }
    .items {
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem 0 0 0.75rem;
    }
</style>

<div class="collection">
    <div class="toggles">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$journalState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={$journalState.showCollected}
            >Show collected</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={$journalState.showUncollected}
            >Show uncollected</CheckboxInput>
        </button>
    </div>

    {#if instance}
        <div class="instance thing-container">
            {#each instance.encounters as encounter}
                <h3>
                    {encounter.name}
                    <span class="counts">
                        <CollectionCount
                            counts={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}`]} />
                    </span>
                </h3>
                <div class="items">
                    {#each getFilteredItems($settingsData, encounter.items) as item}
                        <Item
                            bonusIds={instance.bonusIds}
                            {item}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
