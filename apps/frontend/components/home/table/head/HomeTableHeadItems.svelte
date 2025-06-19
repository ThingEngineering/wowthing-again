<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { wowthingData } from '@/shared/stores/data';
    import { homeState } from '@/stores/local-storage';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { sortKey }: { sortKey: string } = $props();

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        word-spacing: -0.2ch;
    }
</style>

{#each settingsState.activeView.homeItems as itemId (itemId)}
    {@const sortField = `item:${itemId}`}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        onclick={() => setSorting(sortField)}
        onkeypress={() => setSorting(sortField)}
        use:basicTooltip={wowthingData.items.items[itemId].name}
    >
        <WowthingImage name="item/{itemId}" size={16} border={1} />
    </td>
{/each}
