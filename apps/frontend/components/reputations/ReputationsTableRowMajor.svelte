<script lang="ts">
    import { factionMaxRenown } from '@/data/reputation'
    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character, CharacterReputationReputation } from '@/types'
    import type { StaticDataReputation, StaticDataReputationSet } from '@/shared/stores/static/types'

    import Tooltip from '@/components/tooltips/reputation/TooltipReputationMajor.svelte'

    export let character: Character
    export let characterRep: CharacterReputationReputation
    export let reputation: StaticDataReputationSet

    let dataRep: StaticDataReputation
    let quality: number
    let renownLevel: string

    $: {
        quality = 0
        renownLevel = null
        if (reputation !== undefined && characterRep.value !== -1) {
            dataRep = $staticStore.reputations[characterRep.reputationId]

            const maxRenown = factionMaxRenown[characterRep.reputationId]
            const tier = characterRep.value / 2500
            quality = 1 + Math.floor(tier / (maxRenown / 5))
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
        use:componentTooltip={{
            component: Tooltip,
            props: {
                characterRep: characterRep.value,
                character,
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
