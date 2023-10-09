<script lang="ts">
    import { homeState } from '@/stores/local-storage'
    import { imageStrings } from '@/data/icons'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    export let groupIndex: number

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
    }

    const sortKey = 'locationHearth'
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid $border-color;
    }
</style>

<td
    class="sortable"
    class:sorted-by={$homeState.groupSort[groupIndex] === sortKey}
    on:click={() => setSorting(sortKey)}
    on:keypress={() => setSorting(sortKey)}
    use:tippy={'Hearth Location'}
>
    <WowthingImage
        name={imageStrings.hearthstone}
        size={20}
        border={1}
    />
</td>
