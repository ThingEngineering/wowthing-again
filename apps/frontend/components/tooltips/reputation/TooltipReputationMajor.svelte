<script lang="ts">
    import { Constants } from '@/data/constants'
    import { factionMaxRenown } from '@/data/reputation'
    import type { Character } from '@/types'
    import type { StaticDataReputation, StaticDataReputationSet } from '@/stores/static/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    export let character: Character
    export let characterRep: number
    export let dataRep: StaticDataReputation
    export let reputation: StaticDataReputationSet = undefined

    let progress: number
    let tier: number

    $: {
        progress = characterRep % 2500
        tier = Math.floor(characterRep / 2500)
    }
</script>

<style lang="scss">
    .tooltip-body {
        padding: 0.5rem;
    }
    p {
        margin: 0 0 0.4rem 0;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        {#if reputation !== undefined && reputation.both === undefined}
            <WowthingImage
                name={character.faction === 0 ? Constants.icons.alliance : Constants.icons.horde}
                size={20}
            />
        {/if}

        {dataRep.name}
    </h5>

    <div class="tooltip-body">
        <p>Renown {tier} / {factionMaxRenown[dataRep.id]}</p>

        <ProgressBar
            have={progress}
            total={2500}
            shortText={true}
        />
    </div>
</div>
