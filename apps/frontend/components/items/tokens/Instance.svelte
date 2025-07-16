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

    let useV2 = $derived(instance.slug !== 'trial-of-the-crusader');
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle title={name} />

<div class="collection{useV2 ? '-v2' : ''}-section" data-instance-id={instance.id}>
    {#each items as itemIdAndModifier (itemIdAndModifier)}
        <TokenItem {itemIdAndModifier} {useV2} />
    {/each}
</div>
