<script lang="ts">
    import { dungeonMap } from '@/data/dungeon'
    import type { Dungeon } from '@/types'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let dungeonId = 0

    let dungeon: Dungeon
    $: dungeon = dungeonMap[dungeonId]
</script>

<style lang="scss">
    th {
        @include cell-width($width-mplus-dungeon);

        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: 0.3rem;
        padding-top: 0.3rem;
        position: relative;
        text-align: center;

        & :global(img) {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
    }
    .text-overlay {
        position: absolute;
        bottom: 0.3rem;
        left: calc(50% + 0.3rem);
        margin: 0 -0.3rem;
        transform: translateX(-50%);
        white-space: nowrap;
    }
</style>

{#if dungeon !== undefined}
    <th use:tippy={dungeon.getTooltip()}>
        <WowthingImage name={dungeon.icon} size={48} />
        <span class="text-overlay">{dungeon.abbreviation}</span>
    </th>
{:else}
    <th>&nbsp;</th>
{/if}
