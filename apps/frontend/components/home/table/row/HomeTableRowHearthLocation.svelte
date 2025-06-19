<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid $border-color;
    }
    .status-fail {
        text-align: center;
    }
</style>

<td class:status-fail={!character.hearthLocation}>
    {character.hearthLocation || '---'}
</td>
