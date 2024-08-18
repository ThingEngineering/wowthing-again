<script lang="ts">
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import TokenItem from './TokenItem.svelte';

    export let items: Set<number>
    export let name: string
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle title={name} />

<div class="collection-v2-section">
    {#each items as itemId}
        <TokenItem {itemId} />
    {/each}
</div>
