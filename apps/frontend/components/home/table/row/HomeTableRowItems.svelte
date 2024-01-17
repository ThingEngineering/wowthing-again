<script lang="ts">
    import { activeView } from '@/shared/stores/settings'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { itemStore } from '@/stores/item'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        border-left: 1px solid $border-color;
        text-align: right;

        &.faded {
            color: #888;
        }
    }
</style>

{#each $activeView.homeItems as itemId}
    {@const count = character.getItemCount(itemId)}
    <td
        class:faded={count === 0}
        use:basicTooltip={`${count}x ${$itemStore.items[itemId].name}`}
    >
        {toNiceNumber(count)}
    </td>
{/each}
