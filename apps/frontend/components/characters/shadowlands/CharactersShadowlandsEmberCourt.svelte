<script lang="ts">
    import { emberCourtFeatures, emberCourtFriends } from '@/data/covenant'
    import { staticStore, userQuestStore } from '@/stores'
    import tippy, { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character

    import ReputationText from '@/components/common/ReputationText.svelte'
    import Tooltip from '@/components/tooltips/reputation/TooltipReputation.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    let quests: Map<number, boolean>
    $: {
        quests = $userQuestStore.data.characters[character.id]?.quests
    }
</script>

<style lang="scss">
    .court {
        display: flex;
        margin-top: 1rem;
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
    .friend, .icon {
        width: 25%;

        &:not(:last-child) {
            border-right: 1px solid $border-color;
        }
    }
    .friend {
        position: relative;
    }
    .icon {
        text-align: center;
    }
    .name {
        background: #3f1018;
        border-bottom: 1px solid $border-color;
        font-size: 0.9rem;
        padding: 0.2rem 0.2rem;
        text-align: center;

        &.unlocked {
            background: #103f10;
        }
    }
    .reputation {
        padding: 0.2rem 0;

        :global(.progress-container) {
            border-width: 0;
            margin: 0;
        }
    }
    .bff {
        //background: mix($thing-background, $colour-success, 90%);
        color: #88ff88;
    }
    .feature {
        width: 50%;

        &:nth-child(odd) {
            border-right: 1px solid $border-color;
        }
        &:nth-child(n+3) {
            border-top: 1px solid $border-color;
        }
    }
    .types {
        --image-border-width: 2px;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        padding: 0.4rem 0.2rem;
    }
    .type {
        &.locked {
            --image-border-color: #{$colour-fail};

            filter: grayscale(100%);
        }
        &.unlocked {
            --image-border-color: #{$colour-success};
        }
    }
</style>

<div class="court guests border">
    {#each emberCourtFriends as slot}
        <div class="slot">
            {#each slot as friend}
                {@const bff = quests?.has(friend.friendQuestId)}
                {@const rsvp = quests?.has(friend.rsvpQuestId)}
                <div
                    class="friend"
                    use:tippyComponent={{
                        component: Tooltip,
                        props: {
                            bottom: bff ? `<span class="status-success">Friend of a Friend!</span>` : undefined,
                            character,
                            characterRep: character.reputations?.[friend.reputationId] ?? 0,
                            dataRep: $staticStore.data.reputations[friend.reputationId],
                        },
                    }}
                >
                    <div
                        class="name text-overflow"
                        class:bff
                        class:unlocked={rsvp}
                    >
                        {friend.name}
                    </div>
                    
                    <div class="reputation">
                        <ReputationText
                            reputationId={friend.reputationId}
                            {character}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>

<div class="court features border">
    {#each emberCourtFeatures as feature}
        {@const featureUnlocked = quests?.has(feature.unlockQuestId)}
        <div
            class="feature"
        >
            <div
                class="name"
                class:unlocked={featureUnlocked}
            >{feature.name}</div>

            <div class="types">
                {#each feature.types as featureType}
                    {@const typeUnlocked = quests?.has(featureType.unlockQuestId)}
                    <div
                        class="type"
                        class:locked={!typeUnlocked}
                        class:unlocked={typeUnlocked}
                        use:tippy={featureType.name}
                    >
                        <WowthingImage
                            name={featureType.icon}
                            size={40}
                            border={2}
                        />
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
