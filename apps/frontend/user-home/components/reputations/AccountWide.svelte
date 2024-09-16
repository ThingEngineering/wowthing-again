<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { staticStore } from '@/shared/stores/static';
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { userStore } from '@/stores';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let accountSets: [ManualDataReputationSet[], number][];
    export let slug: string;
</script>

<style lang="scss">
    .column {
        --image-border-width: 2px;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .set {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
    .reputation {
        position: relative;
    }
    .level {
        position: absolute;
        bottom: 1px;
        left: 50%;
        transform: translateX(-50%);
    }
</style>

<div class="column">
    {#each accountSets as [reputationSets, reputationsIndex]}
        <div class="set">
            {#each reputationSets as reputationSet, reputationSetsIndex}
                {@const { characterRep, dataRep, cls, renownLevel } = getRenownData({
                    reputation: reputationSet,
                    reputationsIndex,
                    reputationSetsIndex,
                    slug,
                    staticData: $staticStore,
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
                        }
                    }}
                >
                    <WowthingImage
                        name={reputationSet.both.icon}
                        size={48}
                        border={2}
                    />
                    <span class="level pill">{renownLevel || '??'}</span>
                </div>
            {/each}
        </div>
    {/each}
</div>
