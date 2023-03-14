<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { contractAuras } from '@/data/reputation'
    import { staticStore, timeStore } from '@/stores'
    import { toNiceDuration } from '@/utils/formatting'
    import type { Character } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let images: [string, string][]
    $: {
        images = []
        
        if (character.auras?.[359530] === 0) {
            images.push([Constants.icons.anniversary, 'Anniversary Buff'])
        }

        if (character.level < Constants.characterMaxLevel) {
            if (character.chromieTime) {
                images.push([Constants.icons.chromieTime, 'Chromie Time'])
            }
            if (character.isResting) {
                images.push([Constants.icons.resting, 'Resting'])
            }
        }

        if (character.isWarMode) {
            images.push([Constants.icons.warMode, 'War Mode'])
        }

        for (const spellId in contractAuras) {
            if (character.auras?.[spellId] > 0) {
                const diff = DateTime.fromSeconds(character.auras[spellId])
                    .diff($timeStore)
                    .toMillis()
                if (diff <= 0) {
                    continue
                }
                
                const niceRemaining = toNiceDuration(diff).replace('&nbsp;', '')
                const [reputationId, rank] = contractAuras[spellId]
                const reputation = $staticStore.reputations[reputationId]
                images.push([
                    `spell/${spellId}`,
                    `<div class="center">{craftedQuality:${rank}} ${reputation.name}<br>${niceRemaining} remaining</div>`
                ])
            }
        }
        
        if (character.currencies?.[Constants.currencies.dragonridingPassengers]?.quantity > 0) {
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
            {tooltip}
        />
    {/each}
</td>
