<script lang="ts">
    import type { JournalDataInstance } from '@/types/data';

    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import TokenItem from './TokenItem.svelte';

    export let instance: JournalDataInstance
    export let items: number[]
    export let name: string
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle title={name} />

<div class="collection-v2-section" data-instance-id={instance.id}>
    {#each items as itemId}
        <TokenItem {itemId} />
    {/each}
</div>
