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
            debouncedResize = getColumnResizer(auctionsContainer, wrapperDiv, 'table')
            debouncedResize()
        }
    }
    
    afterUpdate(() => debouncedResize?.())
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        gap: 20px;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="wrapper" bind:this={wrapperDiv}>
    {#await commodityAuctionsStore.fetch()}
        L O A D I N G . . .
    {:then commodities}
        {@const characterDatas = getCharacterCommodities($userStore, commodities)}
        {#each characterDatas as characterData}
            <Table
                {characterData}
                {commodities}
            />
        {/each}
    {/await}
</div>
