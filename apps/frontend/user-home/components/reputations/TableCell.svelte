<script lang="ts">
    import orderBy from 'lodash/orderBy';

    import { staticStore } from '@/shared/stores/static';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import findReputationTier from '@/utils/find-reputation-tier';
    import type {
        StaticDataReputation,
        StaticDataReputationTier,
    } from '@/shared/stores/static/types';
    import type {
        Character,
        CharacterReputationParagon,
        CharacterReputationReputation,
        ReputationTier,
    } from '@/types';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import TooltipReputation from '@/components/tooltips/reputation/TooltipReputation.svelte';

    export let character: Character;
    export let reputation: ManualDataReputationSet;
    export let reputationsIndex: number;
    export let reputationSetsIndex: number;
    export let slug: string;

    let characterRep: CharacterReputationReputation;
    let cls: string;
    let dataRep: StaticDataReputation;
    let paragon: CharacterReputationParagon;
    let repTier: ReputationTier;

    // characterRep={character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex]}

    $: {
        if (!reputation) {
            break $;
        }

        characterRep = character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];
        dataRep = $staticStore.reputations[characterRep.reputationId];

        if (!dataRep) {
            break $;
        }

        const actualCharacter = !dataRep.accountWide
            ? character
            : $userStore.apiUpdatedCharacters.find(
                  (char) =>
                      char.reputationData[slug].sets[reputationsIndex][reputationSetsIndex]
                          .value !== -1,
              ) || $userStore.apiUpdatedCharacters[0];

        characterRep =
            actualCharacter.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];

        if (characterRep.value !== -1) {
            dataRep = $staticStore.reputations[characterRep.reputationId];
            if (dataRep) {
                const tiers: StaticDataReputationTier =
                    $staticStore.reputationTiers[dataRep.tierId] || $staticStore.reputationTiers[0];
                repTier = findReputationTier(tiers, characterRep.value);

                if (reputation.paragon && repTier.maxValue === 0) {
                    paragon = character.paragons?.[characterRep.reputationId];
                    if (paragon) {
                        if (paragon.rewardAvailable) {
                            repTier.percent = 'BOX';
                        } else {
                            repTier.percent = ((paragon.current / paragon.max) * 100).toFixed(1);
                        }
                    }
                } else {
                    paragon = undefined;
                }

                if (characterRep.value >= 0) {
                    cls = `reputation${repTier.tier}`;
                } else {
                    const sigh = tiers.minValues.length - repTier.tier;
                    cls = ['status-fail', 'status-warn', 'status-shrug'][Math.min(2, sigh)];
                }
            }
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if characterRep.value !== -1}
    <td
        class={cls}
        use:componentTooltip={{
            component: TooltipReputation,
            props: {
                characterRep: characterRep.value,
                character,
                dataRep,
                paragon,
                reputation,
            },
        }}
    >
        {#if paragon}
            {#if paragon.rewardAvailable}
                <span class="status-fail">BOX!</span>
            {:else}
                {repTier.percent}%
            {/if}
        {:else}
            {repTier.percent}%
        {/if}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
