<script lang="ts">
    import type { JournalDataInstance } from '@/types/data';

    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import TokenItem from './TokenItem.svelte';

    type Props = {
        instance: JournalDataInstance;
        items: string[];
        name: string;
    };
    let { instance, items, name }: Props = $props();
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle title={name} />

<div class="collection-v2-section" data-instance-id={instance.id}>
    {#each items as itemIdAndModifier (itemIdAndModifier)}
        <TokenItem {itemIdAndModifier} />
    {/each}
</div>
