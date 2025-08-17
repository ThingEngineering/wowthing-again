<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    type Props = {
        accountSets: [ManualDataReputationSet[], number][];
        hasCharacterSets: boolean;
        slug: string;
    };
    let { accountSets, hasCharacterSets, slug }: Props = $props();
</script>

<style lang="scss">
    .account-container {
        --image-border-width: 1px;

        columns: var(--columns);
        gap: 1rem;
    }
    .account-set + .account-set {
        margin-top: 1rem;
    }
    .account-rep {
        align-items: stretch;
        min-width: 20rem;
        width: 20rem;

        & + .account-rep {
            margin-top: 0.5rem;
        }
    }
    .icon {
        flex-shrink: 0;
        height: 50px;
        width: 50px;
    }
    .data {
        --bar-height: 1.25rem;

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

<div class="account-container" style:--columns={hasCharacterSets ? '1' : '4'}>
    {#each accountSets as [reputationSets, reputationsIndex] (reputationSets)}
        <div class="account-set no-break">
            {#each reputationSets as reputationSet, reputationSetsIndex (reputationSet)}
                {@const {
                    characterParagon,
                    characterRep,
                    dataRep,
                    cls,
                    renownCurrent,
                    renownMax,
                    repTier,
                } = getRenownData({
                    reputation: reputationSet,
                    reputationsIndex,
                    reputationSetsIndex,
                    slug,
                })}
                <div
                    class="account-rep {cls} flex-wrapper"
                    use:componentTooltip={{
                        component: TooltipReputation,
                        props: {
                            characterRep: characterRep.value,
                            // character,
                            dataRep,
                            // paragon,
                            // reputation,
                        },
                    }}
                >
                    <div class="icon">
                        <WowheadLink type="faction" id={reputationSet.both.id}>
                            <WowthingImage name={reputationSet.both.icon} size={48} border={2} />
                        </WowheadLink>
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

                        {#if characterParagon}
                            <ProgressBar
                                title="Paragon"
                                have={characterParagon.current}
                                total={characterParagon.max}
                            />
                        {:else if repTier && repTier.maxValue > 0}
                            <ProgressBar
                                title={repTier.name}
                                have={repTier.value}
                                total={repTier.maxValue}
                            />
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
            {/each}
        </div>
    {/each}
</div>
