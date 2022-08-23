<script lang="ts">
    import { progressState } from '@/stores/local-storage'
    import tippy from '@/utils/tippy'
    import type { ManualDataProgressGroup } from '@/types/data/manual'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let group: ManualDataProgressGroup
    export let slugKey: string
    export let sortKey: string
    export let sortingBy: boolean

    let icons: string[]
    let onClick: (event: Event) => void
    $: {
        icons = group.icon.split(' ')
        onClick = function(event: Event) {
            event.preventDefault()
            $progressState.sortOrder[slugKey] = sortingBy ? null : sortKey
        }
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

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
    div {
        position: relative;
    }
    .pill {
        bottom: 0px;
    }
</style>

<th
    on:click={onClick}
    use:tippy={group.name}
>
    <div class="split-icon-{icons.length === 2 ? 'yes' : 'no'}">
        {#if icons.length === 2}
            <WowthingImage
                name={icons[0]}
                size={40}
                border={2}
            />
            <WowthingImage
                name={icons[1]}
                size={40}
                border={2}
            />
        {:else}
            <WowthingImage
                name={icons[0]}
                size={40}
                border={2}
            />
        {/if}

        {#if sortingBy}
            <TableSortedBy />
        {/if}

        {#if group.iconText}
            <span class="pill abs-center">{group.iconText}</span>
        {/if}
    </div>
</th>
