<script lang="ts">
    import find from 'lodash/find'

    import { journalStore } from '@/stores'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

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
    .instance {
        border: 1px solid $border-color;
        width: 100%;
    }
    h3 {
        margin: 0;
        padding: 0.25rem 0.5rem;
        width: 100%;
        background: $collection-background;
        border-bottom: 1px solid $border-color;
        border-top: 1px solid $border-color;
        color: #ddd;
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
                {#each encounter.items as item}
                    <Item
                        bonusIds={instance.bonusIds}
                        {item}
                    />
                {/each}
            </div>
        {/each}
    </div>
{/if}
