<script lang="ts">
    import type { StaticDataProgressGroup } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let group: StaticDataProgressGroup
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

<th>
    <WowthingImage name={group.icon} size={48} border={1} tooltip={group.name} />
</th>
