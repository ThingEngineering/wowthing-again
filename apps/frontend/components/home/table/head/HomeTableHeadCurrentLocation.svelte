<script lang="ts">
    import { homeState } from '@/stores/local-storage'
    import { basicTooltip } from '@/shared/utils/tooltips'

    export let groupIndex: number

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
    }

    const sortKey = 'locationCurrent'
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
    use:basicTooltip={'Current Location'}
>
    Location
</td>
