<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let accountSets: [ManualDataReputationSet[], number][];
    export let slug: string;
</script>

<style lang="scss">
    .column {
        --image-border-width: 2px;

        columns: 2;
    }
    .set {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin-bottom: 1rem;
    }
    .reputation {
        position: relative;
    }
    .pill {
        left: 50%;
        pointer-events: none;
        position: absolute;
        transform: translateX(-50%);
    }
    .text {
        top: 1px;
    }
    .level {
        bottom: 1px;
    }
</style>

<div class="column">
    {#each accountSets as [reputationSets, reputationsIndex] (reputationSets)}
        <div class="set no-break">
            {#each reputationSets as reputationSet, reputationSetsIndex (reputationSet)}
                {@const { characterRep, dataRep, cls, renownLevel } = getRenownData({
                    reputation: reputationSet,
                    reputationsIndex,
                    reputationSetsIndex,
                    slug,
                    userData: $userStore,
                })}
                <div
                    class="reputation {cls}"
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
                    <WowheadLink type="faction" id={reputationSet.both.id}>
                        <WowthingImage name={reputationSet.both.icon} size={48} border={2} />
                    </WowheadLink>

                    {#if reputationSet.both.iconText}
                        <span class="text pill">{reputationSet.both.iconText}</span>
                    {/if}

                    <span class="level pill">{renownLevel || '??'}</span>
                </div>
            {/each}
        </div>
    {/each}
</div>
