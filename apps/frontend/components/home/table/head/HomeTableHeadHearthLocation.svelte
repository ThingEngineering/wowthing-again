<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid $border-color;
    }
</style>

<td use:tippy={'Hearth Location'}>
    <WowthingImage
        name={imageStrings.hearthstone}
        size={20}
        border={1}
    />
</td>
