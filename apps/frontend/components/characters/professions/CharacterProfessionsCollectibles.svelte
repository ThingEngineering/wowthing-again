<script lang="ts">
    import maxBy from 'lodash/maxBy';
    import sortBy from 'lodash/sortBy';

    import { Constants } from '@/data/constants';
    import { expansionSlugMap } from '@/data/expansion';
    import { dragonflightProfessionMap, warWithinProfessionMap } from '@/data/professions';
    import { zoneShortName } from '@/data/zones';
    import { wowthingData } from '@/shared/stores/data';
    import { userQuestStore } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import findReputationTier from '@/utils/find-reputation-tier';
    import type { Character } from '@/types';
    import type { TaskProfession } from '@/types/data';
    import type { DbDataThing } from '@/shared/stores/db/types';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import Collectible from './CharacterProfessionsCollectible.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import type { CharacterProps } from '@/types/props';
    import type _ from 'lodash';

    type Props = CharacterProps & {
        expansionSlug: string;
        staticProfession: StaticDataProfession;
    };

    let { character, expansionSlug, staticProfession }: Props = $props();

    let taskProfession = $derived.by(() => {
        const expansion = expansionSlugMap[expansionSlug];
        if (!expansion || expansion.id < 9) {
            return;
        }

        const charProfession = character.professions[staticProfession.id];
        const charSubProfession =
            charProfession?.[staticProfession.expansionSubProfession[expansion.id].id];
        if (!charSubProfession) {
            return;
        }

        return expansion.id === 9
            ? dragonflightProfessionMap[staticProfession.id]
            : warWithinProfessionMap[staticProfession.id];
    });

    let things = $derived.by(() => {
        if (!taskProfession) {
            return;
        }

        const expansion = expansionSlugMap[expansionSlug];
        const results = wowthingData.db
            .search({
                tags: [
                    `expansion:${expansion.id}`,
                    `profession:${staticProfession.slug}`,
                    'treasure:profession',
                ],
            })
            .map(
                (thing) =>
                    [
                        thing,
                        zoneShortName[
                            wowthingData.db.mapsById.get(parseInt(Object.keys(thing.locations)[0]))
                        ],
                    ] as [DbDataThing, string]
            );

        results.sort((a, b) => {
            if (a[1] !== b[1]) {
                return a[1].localeCompare(b[1]);
            }

            return wowthingData.items.items[a[0].contents[0].id].name.localeCompare(
                wowthingData.items.items[b[0].contents[0].id].name
            );
        });

        return results;
    });

    let acRepTier = $derived.by(() =>
        findReputationTier(
            wowthingData.static.reputationTierById.get(398),
            maxBy(
                userState.general.activeCharacters,
                (c) => c.reputations?.[Constants.reputations.artisansConsortium] || 0
            ).reputations?.[Constants.reputations.artisansConsortium]
        )
    );
    let lnRep = $derived.by(
        () =>
            (maxBy(
                userState.general.activeCharacters,
                (c) => c.reputations?.[Constants.reputations.loammNiffen] || 0
            ).reputations?.[Constants.reputations.loammNiffen] || 0) / 2500
    );
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

{#if taskProfession}
    <div class="profession-collectibles">
        {#if taskProfession.masterQuestId || taskProfession?.bookQuests?.length > 0 || things?.length > 0}
            <div class="collection-objects">
                {#if taskProfession.masterQuestId}
                    {@const userHas = userQuestStore.hasAny(
                        character.id,
                        taskProfession.masterQuestId
                    )}
                    <div class="quality5" class:missing={userHas}>
                        <WowthingImage
                            name="achievement/1683"
                            size={40}
                            border={2}
                            tooltip="Profession Master"
                        />

                        {#if userHas}
                            <CollectedIcon />
                        {/if}
                    </div>
                {/if}

                {#each taskProfession.bookQuests || [] as bookQuest, questIndex}
                    {@const userHas = userQuestStore.hasAny(character.id, bookQuest.questId)}
                    {#if bookQuest.source.startsWith('AC ')}
                        {@const repRank = [2, 4, 5][questIndex]}
                        <Collectible
                            disabled={acRepTier.tier > 6 - repRank}
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
                        <Collectible itemId={bookQuest.itemId} text={bookQuest.source} {userHas} />
                    {/if}
                {/each}

                {#each things as [thing, text]}
                    {@const userHas = userQuestStore.hasAny(character.id, thing.trackingQuestId)}
                    <Collectible itemId={thing.contents[0].id} {text} {userHas} />
                {/each}
            </div>
        {/if}

        {#if taskProfession.treasureQuests?.length > 0}
            <div class="collection-objects">
                {#each sortBy( taskProfession.treasureQuests, (tq) => [tq.source, wowthingData.items.items[tq.itemId]] ) as treasureQuest}
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
