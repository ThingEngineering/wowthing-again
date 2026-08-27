<script lang="ts">
    import { Constants } from '@/data/constants';
    import { wowthingData } from '@/shared/stores/data';
    import type { StaticDataReputation } from '@/shared/stores/static/types';
    import type { CharacterReputationParagon } from '@/types';
    import type { ManualDataReputationSet } from '@/types/data/manual';
    import type { CharacterProps } from '@/types/props';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import RenownRewards from './RenownRewards.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = CharacterProps & {
        dataRep: StaticDataReputation;
        characterParagon?: CharacterReputationParagon;
        renownCurrent?: number;
        renownMax?: number;
        reputation?: ManualDataReputationSet;
    };
    let { character, dataRep, characterParagon, renownCurrent, renownMax, reputation }: Props =
        $props();

    let renownValue = $derived(dataRep.maxValues[0] || 2500);
    let progress = $derived(
        renownCurrent < renownMax ? Math.floor((renownCurrent % 1) * renownValue) : 0
    );

    let rewards = $derived(wowthingData.static.renownRewards[dataRep.id] || []);
</script>

<style lang="scss">
    .tooltip-body {
        padding: 0.5rem;
    }
    p {
        margin: 0 0 0.4rem 0;
    }
</style>

<div class="wowthing-tooltip" style:width={rewards.length > 0 ? '25rem' : '15rem'}>
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
        <p>Renown {Math.floor(renownCurrent)} / {renownMax}</p>

        <ProgressBar
            have={progress}
            total={renownCurrent < renownMax ? renownValue : characterParagon?.max}
            shortText={true}
        />

        {#if rewards.length > 0}
            <RenownRewards reputationId={dataRep.id} {renownCurrent} {rewards} />
        {/if}
    </div>
</div>
