<script lang="ts">
    import { Constants } from '@/data/constants'
    import type { Character } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let images: [string, string][]
    $: {
        images = []
        
        if (character.auras?.indexOf(359530) >= 0) {
            images.push([Constants.icons.anniversary, 'Anniversary Buff'])
        }
        if (character.chromieTime) {
            images.push([Constants.icons.chromieTime, 'Chromie Time'])
        }
        if (character.isResting && character.level < Constants.characterMaxLevel) {
            images.push([Constants.icons.resting, 'Resting'])
        }
        if (character.isWarMode) {
            images.push([Constants.icons.warMode, 'War Mode'])
        }
        if (character.currencies?.[2133]?.quantity > 0) {
            images.push([Constants.icons.dragonridingPassengers, 'Dragonriding Passengers'])
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(var(--width, 0));

        --image-margin-top: -4px;

        border-left: 1px solid $border-color;
        white-space: nowrap;

        & :global(img) {
            border-radius: $border-radius;

            &:not(:first-child) {
                margin-left: 3px;
            }
        }
    }
</style>

<td style:--width="calc((22px * {images.length}) + (3px * ({images.length} - 1)))">
    {#each images as [icon, tooltip]}
        <WowthingImage
            name={icon}
            size={20}
            border={1}
            tooltip={tooltip}
        />
    {/each}
</td>
