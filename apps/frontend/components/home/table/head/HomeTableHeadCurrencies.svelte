<script lang="ts">
    import { activeView } from '@/shared/stores/settings'
    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { itemStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'

    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let sortKey: string

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey]
        $homeState.groupSort[sortKey] = current === column ? undefined : column
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        word-spacing: -0.2ch;
    }
</style>

{#each $activeView.homeCurrencies as currencyId}
    {@const sortField = `currency:${currencyId}`}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        on:click={() => setSorting(sortField)}
        on:keypress={() => setSorting(sortField)}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                currency: $staticStore.currencies[currencyId],
                item: $itemStore.items[currencyId - 1000000],
            }
        }}
    >
        {#if currencyId > 1000000}
            <WowthingImage
                name="item/{currencyId - 1000000}"
                size={16}
                border={1}
            />
        {:else}
            <WowthingImage
                name="currency/{currencyId}"
                size={16}
                border={1}
            />
        {/if}
    </td>
{/each}
