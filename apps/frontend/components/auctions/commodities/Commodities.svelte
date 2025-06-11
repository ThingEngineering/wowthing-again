<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userStore } from '@/stores';
    import { getColumnResizer } from '@/utils/get-column-resizer';

    import { getCharacterCommodities } from './get-character-commodities';
    import { commodityAuctionsStore } from './store';

    import Table from './Table.svelte';

    let { auctionsContainer }: { auctionsContainer: HTMLElement } = $props();

    let wrapperDiv = $state<HTMLElement>(null);
    let debouncedResize = $derived(
        wrapperDiv
            ? getColumnResizer(auctionsContainer, wrapperDiv, 'table', {
                  columnCount: '--column-count',
              })
            : null
    );

    $effect(() => debouncedResize?.());
</script>

<style lang="scss">
    .wrapper {
        column-count: var(--column-count, 1);
        gap: 20px;
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#await commodityAuctionsStore.fetch()}
    <div class="wrapper">L O A D I N G . . .</div>
{:then commodities}
    {@const characterDatas = getCharacterCommodities(
        commodities,
        browserState.current.auctions.commoditiesCurrentExpansion
    )}
    <div class="wrapper" bind:this={wrapperDiv}>
        {#each characterDatas as characterData (characterData.characterId)}
            <Table {characterData} {commodities} />
        {/each}
    </div>
{/await}
