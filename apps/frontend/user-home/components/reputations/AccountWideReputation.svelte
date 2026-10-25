<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { Faction } from '@/enums/faction';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        reputationsIndex: number;
        reputationSet: ManualDataReputationSet;
        reputationSetsIndex: number;
        slug: string;
    };
    let { reputationsIndex, reputationSet, reputationSetsIndex, slug }: Props = $props();

    let { characterParagon, characterRep, cls, dataRep, renownCurrent, renownMax, repTier } =
        $derived(
            getRenownData({
                reputation: reputationSet,
                reputationsIndex,
                reputationSetsIndex,
                slug,
            })
        );

    let hasAlliance = $derived(!!reputationSet.alliance);
    let hasHorde = $derived(!!reputationSet.horde);
    let repId = $derived(
        reputationSet.both?.id || reputationSet.alliance?.id || reputationSet.horde?.id
    );
    let repIcon = $derived(
        reputationSet.both?.icon || reputationSet.alliance?.icon || reputationSet.horde?.icon
    );
</script>

<style lang="scss">
    .account-rep {
        align-items: stretch;
        min-width: 20rem;
        width: 20rem;

        &:global(+ .account-rep) {
            margin-top: 0.5rem;
        }
    }
    .icon {
        flex-shrink: 0;
        height: 50px;
        position: relative;
        width: 50px;

        .faction {
            top: -2px;
            position: absolute;
            left: 0;
        }
    }
    .data {
        --bar-height: 1.25rem;

        align-content: center;
        background: var(--color-thing-background);
        border: 1px solid var(--image-border-color);
        border-radius: var(--border-radius);
        flex-grow: 1;
        margin-left: var(--padding-size);
        overflow: hidden;

        :global(> button) {
            border-bottom: 0;
            border-left: 0;
            border-right: 0;
            padding-bottom: 1px;
        }
    }
    .name {
        padding-left: 0.6rem;
    }
    .level {
        font-size: 90%;
        padding-right: 0.6rem;
        white-space: nowrap;
        word-spacing: -0.2ch;
    }
</style>

<div
    class="account-rep {cls} flex-wrapper"
    data-id={repId}
    use:componentTooltip={{
        component: TooltipReputation,
        propsFunc: () => ({
            characterRep: characterRep.value,
            dataRep,
            renownCurrent,
            renownMax,
        }),
    }}
>
    <div class="icon">
        <WowheadLink type="faction" id={repId}>
            <WowthingImage name={repIcon} size={48} border={2} />
        </WowheadLink>

        {#if hasAlliance && !hasHorde}
            <div class="faction drop-shadow">
                <FactionIcon faction={Faction.Alliance} border={2} />
            </div>
        {:else if !hasAlliance && hasHorde}
            <div class="faction drop-shadow">
                <FactionIcon faction={Faction.Horde} border={2} />
            </div>
        {/if}
    </div>
    <div class="data">
        <div class="flex-wrapper {cls}">
            <div class="name text-overflow">{dataRep.name}</div>
            <div class="level">
                {#if renownMax}
                    {Math.floor(renownCurrent)} / {renownMax}
                {:else if repTier && repTier.maxValue === 0}
                    {repTier.name}
                {/if}
            </div>
        </div>

        {#if characterParagon && ((renownMax && renownCurrent === renownMax) || repTier?.tier === 1)}
            <ProgressBar
                title="Paragon"
                have={characterParagon.current}
                total={characterParagon.max}
            />
        {:else if repTier && repTier.maxValue > 0}
            <ProgressBar title={repTier.name} have={repTier.value} total={repTier.maxValue} />
        {:else if dataRep && renownCurrent < renownMax}
            {@const perRenown = dataRep.maxValues[0]}
            <ProgressBar
                title="Renown"
                have={Math.floor((renownCurrent % 1) * perRenown)}
                total={perRenown}
            />
        {/if}
    </div>
</div>
