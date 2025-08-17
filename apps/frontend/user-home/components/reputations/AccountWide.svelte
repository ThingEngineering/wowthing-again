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
        slug: string;
    };
    let { accountSets, slug }: Props = $props();
</script>

<style lang="scss">
    .account-wide {
        columns: 4;
        gap: 1rem;
    }
    table {
        --image-border-width: 2px;

        min-width: 20rem;
        width: 20rem;

        & + table {
            margin-top: 1rem;
        }
    }
    .icon {
        padding: 2px 0;
        width: 52px;
    }
    .data {
        --bar-height: 1.25rem;

        padding-left: var(--padding-size);

        :global(> button) {
            border-bottom: 0;
            border-right: 0;
            padding-bottom: 1px;
        }
    }
    .level {
        padding-right: var(--padding-size);
        white-space: nowrap;
    }
    .value {
        border-left: 0 !important;
    }
</style>

<div class="account-wide">
    {#each accountSets as [reputationSets, reputationsIndex] (reputationSets)}
        <table class="table table-striped2 b-t no-break">
            <tbody>
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
                    <tr
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
                        <td class="icon">
                            <WowheadLink type="faction" id={reputationSet.both.id}>
                                <WowthingImage
                                    name={reputationSet.both.icon}
                                    size={48}
                                    border={2}
                                />
                            </WowheadLink>
                        </td>
                        <td class="data">
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
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/each}
</div>
