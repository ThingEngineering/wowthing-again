<script lang="ts">
    import maxBy from 'lodash/maxBy'
    import sortBy from 'lodash/sortBy'

    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { dragonflightProfessionMap } from '@/data/professions'
    import { itemStore, userQuestStore, userStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import findReputationTier from '@/utils/find-reputation-tier'
    import type { Character } from '@/types'
    import type { DragonflightProfession } from '@/types/data'
    import type { StaticDataProfession } from '@/stores/static/types'

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

    $: acRepTier = findReputationTier(
        $staticStore.reputationTiers[398],
        maxBy(
            $userStore.characters,
            (c) => c.reputations?.[Constants.reputations.artisansConsortium] || 0
        ).reputations?.[Constants.reputations.artisansConsortium]
    )
    $: lnRep = (maxBy(
        $userStore.characters,
        (c) => c.reputations?.[Constants.reputations.loammNiffen] || 0
    ).reputations?.[Constants.reputations.loammNiffen] || 0) / 2500
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
        padding-bottom: 1rem;
        width: 100%;
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
                    {@const userHas = userQuestStore.hasAny(character.id, bookQuest.questId)}
                    {#if bookQuest.source.startsWith('AC')}
                        {@const repRank = [2, 4, 5][questIndex]}
                        <Collectible
                            disabled={acRepTier.tier > (6 - repRank)}
                            itemId={bookQuest.itemId}
                            text={`AC ${repRank}`}
                            {userHas}
                        />
                    {:else if bookQuest.source === 'LN'}
                        <Collectible
                            disabled={lnRep < 12}
                            itemId={bookQuest.itemId}
                            text="LN 12"
                            {userHas}
                        />
                    {:else}
                        <Collectible
                            itemId={bookQuest.itemId}
                            text={bookQuest.source}
                            {userHas}
                        />
                    {/if}
                {/each}
            </div>
        {/if}

        {#if dfData.treasureQuests?.length > 0}
            <div class="collection-objects">
                {#each sortBy(dfData.treasureQuests, (tq) => [tq.source, $itemStore.items[tq.itemId]]) as treasureQuest}
                    <Collectible
                        itemId={treasureQuest.itemId}
                        text={treasureQuest.source}
                        userHas={userQuestStore.hasAny(character.id, treasureQuest.questId)}
                    />
                {/each}
            </div>
        {/if}
    </div>
{/if}
