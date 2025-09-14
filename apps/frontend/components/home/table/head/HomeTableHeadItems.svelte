<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { SortableProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
    td {
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

{#each settingsState.activeView.homeItems as itemId (itemId)}
    {@const itemIdString = itemId.toString()}
    <td
        class="sortable sorted-{getSortState(itemIdString)}"
        data-tooltip={wowthingData.items.items[itemId].name}
        onclick={() => setSortState(itemIdString)}
    >
        <WowthingImage name="item/{itemId}" size={16} border={1} />
    </td>
{/each}
