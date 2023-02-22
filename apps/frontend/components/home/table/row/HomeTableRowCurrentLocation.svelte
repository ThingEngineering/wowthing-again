<script lang="ts">
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character

    let location: string
    $: {
        location = (character.currentLocation || '---')
        if (location.indexOf(',') === -1) {
            location = location.split(' > ')
                .map((loc, index) => `<span class="location${index}">${loc}</span>`)
                .join(' > ')
        }
    }
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
    use:tippy={{ allowHTML: true, content: location }}
>
    {@html location}
</td>
