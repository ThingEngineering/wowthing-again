<script lang="ts">
    import tippy from '@/utils/tippy'
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid $border-color;
    }
</style>

<td use:tippy={'Current Location'}>
    Location
</td>
