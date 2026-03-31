<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { SortableProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
    td {
        --image-border-width: 2px;
        --padding-left: 0;
        --padding-right: 0;
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

{#each settingsState.activeView.homeItems as itemId (itemId)}
    {@const itemIdString = itemId.toString()}
    {@const item = wowthingData.items.items[itemId]}
    <td
        class="sortable sorted-{getSortState(itemIdString)} quality{item?.quality || 1}-border"
        data-tooltip={wowthingData.items.items[itemId].name}
        onclick={() => setSortState(itemIdString)}
    >
        <WowthingImage name="item/{itemId}" size={16} border={2} />
    </td>
{/each}
