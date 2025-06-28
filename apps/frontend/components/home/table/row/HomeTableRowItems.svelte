<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { wowthingData } from '@/shared/stores/data';
    import { toNiceNumber } from '@/utils/formatting';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        border-left: 1px solid var(--border-color);
        text-align: right;

        &.faded {
            color: #888;
        }
    }
</style>

{#each settingsState.activeView.homeItems as itemId (itemId)}
    {@const count = character.getItemCount(itemId)}
    <td
        class:faded={count === 0}
        use:basicTooltip={`${count}x ${wowthingData.items.items[itemId].name}`}
    >
        {toNiceNumber(count)}
    </td>
{/each}
