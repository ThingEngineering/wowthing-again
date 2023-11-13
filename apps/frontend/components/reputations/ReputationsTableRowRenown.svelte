<script lang="ts">
    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character, CharacterReputationParagon, CharacterReputationReputation } from '@/types'
    import type { StaticDataReputation, StaticDataReputationSet } from '@/shared/stores/static/types'

    import Tooltip from '@/components/tooltips/reputation/TooltipReputationRenown.svelte'

    export let character: Character
    export let characterRep: CharacterReputationReputation
    export let reputation: StaticDataReputationSet

    let characterParagon: CharacterReputationParagon
    let dataRep: StaticDataReputation
    let quality: number
    let renownLevel: string

    $: {
        quality = 0
        renownLevel = null
        if (reputation !== undefined && characterRep.value !== -1) {
            dataRep = $staticStore.reputations[characterRep.reputationId]
            const currency = $staticStore.currencies[dataRep.renownCurrencyId]
            const maxRenown = currency.maxTotal


            let tier = characterRep.value / 2500
            quality = 1 + Math.floor(tier / (maxRenown / 5))

            characterParagon = character.paragons?.[characterRep.reputationId]
            if (characterParagon) {
                tier += (characterParagon.current / characterParagon.max)
            }

            renownLevel = (Math.floor(tier * 100) / 100).toFixed(2)
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if renownLevel}
    <td
        class="quality{quality}"
        class:status-fail={characterParagon?.rewardAvailable}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                characterRep: characterRep.value,
                character,
                characterParagon,
                dataRep,
                reputation,
            }
        }}
    >
        {renownLevel}
    </td>
{:else}
    <td></td>
{/if}
