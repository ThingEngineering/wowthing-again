<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { dragonflightProfessionMap } from '@/data/professions'
    import { staticStore, userQuestStore } from '@/stores'
    import findReputationTier from '@/utils/find-reputation-tier'
    import type { Character } from '@/types'
    import type { DragonflightProfession } from '@/types/data'
    import type { StaticDataProfession } from '@/types/data/static'

    import Collectible from './CharacterProfessionsCollectible.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let expansionSlug: string
    export let staticProfession: StaticDataProfession

    let dfData: DragonflightProfession
    $: {
        dfData = undefined

        const expansion = expansionSlugMap[expansionSlug]
        if (!expansion || expansion.id !== Constants.expansion) {
            break $
        }
        
        const charProfession = character.professions[staticProfession.id]
        const charSubProfession = charProfession?.[staticProfession.subProfessions[expansion.id].id]
        if (!charSubProfession) {
            break $
        }
        
        dfData = dragonflightProfessionMap[staticProfession.id]
    }

    $: tiers = $staticStore.reputationTiers[398]
                

</script>

<style lang="scss">
    .profession-collectibles {
        --image-border-width: 2px;

        flex-direction: column;
        margin: 0 0.5rem;
    }
    .collection-objects {
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 1rem;
        width: 100%;
    }
    .collectible-group {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;

        > div {
            position: relative;
        }
    }
</style>

{#if dfData}
    <div class="profession-collectibles">
        {#if dfData.masterQuestId || dfData?.bookQuests?.length > 0}
            <div class="collection-objects">
                {#if dfData.masterQuestId}
                    {@const userHas = userQuestStore.hasAny(character.id, dfData.masterQuestId)}
                    <div
                        class="quality5"
                        class:missing={userHas}
                    >
                        <WowthingImage
                            name="achievement/1683"
                            size={40}
                            border={2}
                            tooltip={"Profession Master"}
                        />

                        {#if userHas}
                            <div class="collected-icon drop-shadow">
                                <IconifyIcon icon={mdiCheckboxOutline} />
                            </div>
                        {/if}
                    </div>
                {/if}

                {#each (dfData.bookQuests || []) as bookQuest, questIndex}
                    {@const repRank = [2, 4, 5][questIndex]}
                    {@const repTier = findReputationTier(tiers, character.reputations?.[2544] || 0)}
                    <Collectible
                        disabled={repTier.tier > (6 - repRank)}
                        itemId={bookQuest.itemId}
                        text={`AC ${repRank}`}
                        userHas={userQuestStore.hasAny(character.id, bookQuest.questId)}
                    />
                {/each}
            </div>
        {/if}

        {#if dfData.treasureQuests?.length > 0}
            <div class="collection-objects">
                {#each dfData.treasureQuests as treasureQuest}
                    <Collectible
                        itemId={treasureQuest.itemId}
                        userHas={userQuestStore.hasAny(character.id, treasureQuest.questId)}
                    />
                {/each}
            </div>
        {/if}
    </div>
{/if}
