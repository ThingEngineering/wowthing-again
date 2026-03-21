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
        characterRep: number;
        dataRep: StaticDataReputation;
        characterParagon?: CharacterReputationParagon;
        reputation?: ManualDataReputationSet;
    };
    let { character, characterRep, dataRep, characterParagon, reputation }: Props = $props();

    let maxRenown = $derived(
        wowthingData.static.currencyById.get(dataRep.renownCurrencyId)?.maxTotal || 1
    );
    let renownValue = $derived(dataRep.maxValues[0] || 2500);
    let tier = $derived(Math.floor(characterRep / renownValue));
    let progress = $derived(
        tier < maxRenown ? characterRep % renownValue : characterParagon?.current || 0
    );

    let upcomingRewards = $derived(
        (wowthingData.static.renownRewards[dataRep.id] || []).filter(
            (reward) => reward.level > tier
        )
    );
</script>

<style lang="scss">
    .wowthing-tooltip {
        width: 20rem;
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

        {#if upcomingRewards.length > 0}
            <RenownRewards rewards={upcomingRewards} />
        {/if}
    </div>
</div>
