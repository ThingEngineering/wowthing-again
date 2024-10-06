<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { userStore } from '@/stores'
    import { getColumnResizer } from '@/utils/get-column-resizer'

    import { getCharacterCommodities } from './get-character-commodities'
    import { commodityAuctionsStore } from './store'

    import Table from './Table.svelte'

    export let auctionsContainer: HTMLElement

    let debouncedResize: () => void
    let wrapperDiv: HTMLElement
    $: {
        if (wrapperDiv) {
            debouncedResize = getColumnResizer(
                auctionsContainer,
                wrapperDiv,
                'table',
                {
                    columnCount: '--column-count',
                }
            )
            debouncedResize()
        }
    }
    
    afterUpdate(() => debouncedResize?.())
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
    {@const characterDatas = getCharacterCommodities($userStore, commodities)}
    <div class="wrapper" bind:this={wrapperDiv}>
        {#each characterDatas as characterData}
            <Table
                {characterData}
                {commodities}
            />
        {/each}
    </div>
{/await}
