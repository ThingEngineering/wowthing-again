<script lang="ts">
    import { progressState } from '@/stores/local-storage'
    import type { StaticDataProgressGroup } from '@/types'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let group: StaticDataProgressGroup
    export let slug: string
    export let sortKey: string
    export let sortingBy: boolean

    let onClick: (event: Event) => void
    $: {
        onClick = function(event: Event) {
            event.preventDefault()
            console.log(slug, sortingBy, sortKey)
            $progressState.sortOrder[slug] = sortingBy ? null : sortKey
        }
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-progress);

        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: $width-padding;
        padding-top: $width-padding;
        text-align: center;

        & :global(img) {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
    }
</style>

<th
    on:click={onClick}
>
    <WowthingImage
        name={group.icon}
        size={48}
        border={1}
        tooltip={group.name}
    />

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
