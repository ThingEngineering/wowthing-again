<script lang="ts">
    import orderBy from 'lodash/orderBy'

    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { userStore } from '@/stores';
    import type { StaticDataReputation, StaticDataReputationSet } from '@/shared/stores/static/types'
    import type { Character, CharacterReputationParagon, CharacterReputationReputation } from '@/types'

    import Tooltip from '@/components/tooltips/reputation/TooltipReputationRenown.svelte'

    export let character: Character
    export let reputation: StaticDataReputationSet
    export let reputationsIndex: number
    export let reputationSetsIndex: number
    export let slug: string

    let characterParagon: CharacterReputationParagon
    let characterRep: CharacterReputationReputation
    let dataRep: StaticDataReputation
    let quality: number
    let renownLevel: string

    $: {
        quality = 0
        renownLevel = null
        if (!reputation) { break $ }

        characterRep = character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];
        dataRep = $staticStore.reputations[characterRep.reputationId]

        const actualCharacter = !dataRep.accountWide
            ? character
            : orderBy(
                $userStore.activeCharacters
                    .filter((char) => !!char.reputationData[slug].sets[reputationsIndex][reputationSetsIndex]),
                (char) => -char.lastApiUpdate.toUnixInteger()
            )[0];
        
        characterRep = actualCharacter.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];
        if (characterRep.value !== -1) {
            const currency = $staticStore.currencies[dataRep.renownCurrencyId]
            const maxRenown = currency.maxTotal
 
            let tier = characterRep.value / 2500
            quality = 1 + Math.floor(tier / (maxRenown / 5))

            characterParagon = actualCharacter.paragons?.[characterRep.reputationId]
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
