<script lang="ts">
    import { activeView } from '@/shared/stores/settings'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { itemStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'

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

{#each $activeView.homeItems as itemId}
    {@const sortField = `item:${itemId}`}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        on:click={() => setSorting(sortField)}
        on:keypress={() => setSorting(sortField)}
        use:basicTooltip={$itemStore.items[itemId].name}
    >
        <WowthingImage
            name="item/{itemId}"
            size={16}
            border={1}
        />
    </td>
{/each}
