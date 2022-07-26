<script lang="ts">
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character
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

<td
    class="text-overflow"
    class:status-fail={!character.currentLocation}
    use:tippy={character.currentLocation || '---'}
>
    {character.currentLocation || '---'}
</td>
