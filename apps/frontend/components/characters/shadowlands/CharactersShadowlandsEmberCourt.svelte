<script lang="ts">
    import {
        emberCourtFeatures,
        emberCourtFriends,
        emberCourtUpgrades,
        emberCourtUpgrades2,
        type EmberCourtFeature,
        type EmberCourtFeatureType,
    } from '@/data/covenant';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import findReputationTier from '@/utils/find-reputation-tier';
    import { userState } from '@/user-home/state/user';
    import type { CharacterProps } from '@/types/props';

    import ReputationText from '@/components/common/ReputationText.svelte';
    import Tooltip from '@/components/tooltips/reputation/TooltipReputation.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { character }: CharacterProps = $props();

    let tier = $derived.by(() =>
        findReputationTier(
            wowthingData.static.reputationTierById.get(
                wowthingData.static.reputationById.get(2445).tierId
            ),
            character.reputations?.[2445] ?? 0
        )
    );

    let quests = $derived.by(() => userState.quests.characterById.get(character.id).hasQuestById);

    const thingSets: [EmberCourtFeature[], number][] = [
        [emberCourtFeatures, 40],
        [emberCourtUpgrades, 32],
        [emberCourtUpgrades2, 48],
    ];

    const getTooltip = function (type: EmberCourtFeatureType): string {
        let ret = type.name;
        if (type.unlockReputation > 0) {
            const tierName =
                wowthingData.static.reputationTierById.get(0).names[8 - type.unlockReputation];
            ret += `<br><br>Requires <span class="reputation${type.unlockReputation}">${tierName}</span> reputation`;
        }
        return ret;
    };
</script>

<style lang="scss">
    .court {
        display: flex;
        margin-top: 0.75rem;
        overflow: hidden;
    }
    .guests {
        flex-direction: column;
    }
    .features {
        flex-wrap: wrap;
    }
    .slot {
        display: flex;

        &:not(:last-child) {
            border-bottom: 1px solid #aaa;
        }
    }
    .friend {
        position: relative;
        width: 25%;

        &:not(:last-child) {
            border-right: 1px solid var(--border-color);
        }
    }
    .name {
        background: #3f1018;
        border-bottom: 1px solid var(--border-color);
        font-size: 0.9rem;
        padding: 0.2rem 0.2rem;
        text-align: center;
    }
    .unlocked {
        background: #103f10;
    }
    .reputation {
        padding: 0.2rem 0;

        :global(.progress-container) {
            border-width: 0;
            margin: 0;
        }
    }
    .feature {
        --image-border-width: 2px;
        display: flex;
        gap: 0.4rem;
        justify-content: center;
        padding: 0.3rem;
        width: 50%;

        &:nth-child(odd) {
            border-right: 1px solid var(--border-color);
        }
        &:nth-child(n + 3) {
            border-top: 1px solid var(--border-color);
        }
        &:only-child {
            border-right-width: 0;
            width: 100%;
        }
    }
    .type {
        &.locked {
            filter: grayscale(100%);
        }
        &.available {
            --image-border-color: var(--color-fail);
        }
        &.unlocked {
            --image-border-color: var(--color-success);
        }
    }
</style>

<div class="court guests border">
    {#each emberCourtFriends as slot (slot)}
        <div class="slot">
            {#each slot as friend (friend)}
                {@const bff = quests?.has(friend.friendQuestId)}
                {@const rsvp = quests?.has(friend.rsvpQuestId)}
                <div
                    class="friend"
                    use:componentTooltip={{
                        component: Tooltip,
                        props: {
                            bottom: bff
                                ? `<span class="status-success">Friend of a Friend!</span>`
                                : undefined,
                            character,
                            characterRep: character.reputations?.[friend.reputationId] ?? 0,
                            dataRep: wowthingData.static.reputationById.get(friend.reputationId),
                        },
                    }}
                >
                    <div
                        class="name text-overflow"
                        class:status-success={bff}
                        class:unlocked={rsvp}
                    >
                        {friend.name}
                    </div>

                    <div class="reputation">
                        <ReputationText reputationId={friend.reputationId} {character} />
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>

{#each thingSets as [things, iconSize]}
    <div class="court features border">
        {#each things as thing}
            {@const featureUnlocked = quests?.has(thing.unlockQuestId)}
            <div class="feature" class:unlocked={featureUnlocked}>
                {#each thing.types as type}
                    {@const typeUnlocked = quests?.has(type.unlockQuestId)}
                    {@const typeReputation = type.unlockReputation || thing.unlockReputation || 0}
                    <div
                        class="type"
                        class:locked={!typeUnlocked && tier?.tier > typeReputation}
                        class:available={!typeUnlocked && tier?.tier <= typeReputation}
                        class:unlocked={typeUnlocked}
                        data-tooltip={getTooltip(type)}
                    >
                        <WowthingImage name={type.icon} size={iconSize} border={2} />
                    </div>
                {/each}
            </div>
        {/each}
    </div>
{/each}
