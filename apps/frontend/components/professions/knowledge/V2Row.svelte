<script lang="ts">
    import { warWithinProfessions } from '@/data/professions';
    import { warWithinZones } from '@/data/zones';
    import { Profession } from '@/enums/profession';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import type { TaskProfessionQuest } from '@/types/data';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/profession-knowledge/TooltipProfessionKnowledge.svelte';

    let { character }: CharacterProps = $props();

    type ZoneData = {
        have: number;
        status?: string;
        total: number;
        items: ZoneItem[];
    };
    type ZoneItem = {
        have: boolean;
        profession: Profession;
        itemId?: number;
        quest?: TaskProfessionQuest;
        source?: string;
    };

    let data: ZoneData[] = $derived.by(() => {
        const ret: ZoneData[] = [];

        // Zones
        for (const zone of warWithinZones) {
            if (zone === null) {
                ret.push(null);
                continue;
            }

            const zoneData: ZoneData = {
                have: 0,
                total: 0,
                items: [],
            };

            for (const profData of warWithinProfessions) {
                if (!character.professions?.[profData.id]) {
                    continue;
                }

                if (zone.name.endsWith('Books')) {
                    const bookQuests = (profData.bookQuests || []).filter(
                        (bq) =>
                            bq.source === zone.shortName ||
                            bq.source.startsWith(`${zone.shortName} `)
                    );

                    const characterRenown = zone.reputationId
                        ? Math.floor((character.reputations?.[zone.reputationId] ?? 0) / 2500)
                        : 0;

                    for (const bookQuest of bookQuests) {
                        const bookData = {
                            have: userState.quests.characterById
                                .get(character.id)
                                .hasQuestById.has(bookQuest.questId),
                            quest: bookQuest,
                            profession: profData.id,
                        };

                        const requiredRenown = parseInt(bookQuest.source.split(' ')[1]);
                        if (!bookData.have) {
                            if (!isNaN(requiredRenown) && requiredRenown <= characterRenown) {
                                zoneData.status = 'fail';
                            } else if (
                                bookQuest.source.startsWith('AC ') ||
                                bookQuest.source === 'LN'
                            ) {
                                zoneData.status = 'fail';
                            }
                        }

                        zoneData.items.push(bookData);
                    }
                } else {
                    const professionSlug = wowthingData.static.professionById.get(profData.id).slug;
                    const things = wowthingData.db.search({
                        maps: [zone.map],
                        tags: [
                            `expansion:10`,
                            `profession:${professionSlug}`,
                            'treasure:profession',
                        ],
                    });

                    things.sort((a, b) =>
                        wowthingData.items.items[a.contents[0].id].name.localeCompare(
                            wowthingData.items.items[b.contents[0].id].name
                        )
                    );

                    for (const thing of things) {
                        zoneData.items.push({
                            have: userState.quests.characterById
                                .get(character.id)
                                .hasQuestById.has(thing.trackingQuestId),
                            itemId: thing.contents[0].id,
                            profession: profData.id,
                            source: zone.shortName,
                        });
                    }
                }
            }

            zoneData.have = zoneData.items.filter((item) => item.have).length;
            zoneData.total = zoneData.items.length;
            zoneData.items.sort((a, b) =>
                Profession[a.profession].localeCompare(Profession[b.profession])
            );

            if (zone.name.endsWith('Books')) {
                if (!zoneData.status) {
                    zoneData.status = zoneData.have < zoneData.total ? 'shrug' : 'success';
                }
            } else {
                zoneData.status =
                    zoneData.have === 0
                        ? 'fail'
                        : zoneData.have < zoneData.total
                          ? 'shrug'
                          : 'success';
            }

            ret.push(zoneData);
        }

        return ret;
    });
</script>

<style lang="scss">
    .profession-knowledge {
        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .faded {
        color: #aaa;
    }
</style>

<td class="spacer"></td>
{#each warWithinZones as zone, zoneIndex (zoneIndex)}
    {@const zoneData = data[zoneIndex]}
    {#if zone === null}
        <td class="spacer"></td>
    {:else if zoneData.items.length > 0}
        <td
            class="profession-knowledge status-{zoneData.status}"
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    character,
                    reputationId: 0,
                    zoneData,
                    zoneName: zone.name,
                },
            }}
        >
            {zoneData.have} / {zoneData.total}
        </td>
    {:else}
        <td class="profession-knowledge faded">---</td>
    {/if}
{/each}
