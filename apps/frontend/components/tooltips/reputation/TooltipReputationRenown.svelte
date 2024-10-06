<script lang="ts">
    import { Constants } from '@/data/constants'
    import { staticStore } from '@/shared/stores/static'
    import type { StaticDataReputation } from '@/shared/stores/static/types'
    import type { Character, CharacterReputationParagon } from '@/types'
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let characterParagon: CharacterReputationParagon = undefined
    export let characterRep: number
    export let dataRep: StaticDataReputation
    export let reputation: ManualDataReputationSet = undefined

    let progress: number
    let tier: number

    $: maxRenown = $staticStore.currencies[dataRep.renownCurrencyId]?.maxTotal || 1
    $: renownValue = dataRep.maxValues[0] || 2500
    $: {
        tier = Math.floor(characterRep / renownValue)
        progress = tier < maxRenown ? characterRep % renownValue : (characterParagon?.current || 0)
    }
</script>

<style lang="scss">
    .wowthing-tooltip {
        width: 15rem;
    }
    .tooltip-body {
        padding: 0.5rem;
    }
    p {
        margin: 0 0 0.4rem 0;
    }
</style>

<div class="wowthing-tooltip">
    <h4 class="text-overflow">
        {#if reputation?.both === undefined && character}
            <WowthingImage
                name={character.faction === 0 ? Constants.icons.alliance : Constants.icons.horde}
                size={20}
            />
        {/if}

        {dataRep.name}
    </h4>
    {#if character}
        <h5>{character.name}</h5>
    {/if}

    <div class="tooltip-body">
        <p>Renown {tier} / {maxRenown}</p>

        <ProgressBar
            have={progress}
            total={tier < maxRenown ? renownValue : characterParagon?.max}
            shortText={true}
        />
    </div>
</div>
