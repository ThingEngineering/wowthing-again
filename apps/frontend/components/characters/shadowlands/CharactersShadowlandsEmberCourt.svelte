<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { covenantMap, covenantOrder, emberCourtFriends } from '@/data/covenant'
    import { iconStrings } from '@/data/icons'
    import { staticStore, userQuestStore, userStore } from '@/stores'
    import tippy, { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ReputationBar from '@/components/common/ReputationBar.svelte'
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
        flex-direction: column;
        margin-top: 1rem;
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
        background: #10283f;
        border-bottom: 1px solid $border-color;
        font-size: 0.9rem;
        padding: 0.2rem 0.2rem;
        text-align: center;
    }
    .reputation {
        :global(.progress-container) {
            border-width: 0;
            margin: 0;
        }
    }
    .bff {
        //background: mix($thing-background, $colour-success, 90%);
        color: #88ff88;
    }
</style>

<div class="court border">
    <div class="slot">
        {#each covenantOrder as covenantId}
            <div class="icon">
                <WowthingImage
                    name={covenantMap[covenantId].icon}
                    size={48}
                    border={0}
                />
            </div>
        {/each}
    </div>

    {#each emberCourtFriends as slot}
        <div class="slot">
            {#each slot as friend}
                {@const bff = Math.random() * 5 > 2 || quests?.has(friend.friendQuestId)}
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
                    >
                        {friend.name}
                    </div>
                    
                    <div class="reputation">
                        <ReputationBar
                            reputationId={friend.reputationId}
                            small={true}
                            {character}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>
