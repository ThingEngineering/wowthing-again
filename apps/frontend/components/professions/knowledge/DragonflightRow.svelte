<script lang="ts">
    import orderBy from 'lodash/orderBy';

    import {
        dragonflightKnowledge,
        dragonflightProfessionMap,
        dragonflightProfessions,
    } from '@/data/professions';
    import { Profession } from '@/enums/profession';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userQuestStore } from '@/stores';
    import type { Character } from '@/types';

    import Tooltip from '@/components/tooltips/profession-knowledge/TooltipProfessionKnowledge.svelte';

    export let character: Character;

    type ZoneData = {
        have: number;
        status?: string;
        total: number;
        items: ZoneItem[];
    };
    type ZoneItem = {
        have: boolean;
        itemId: number;
        profession: Profession;
        source?: string;
    };
    let data: ZoneData[];
    $: {
        data = [];

        // Zones
        dragonflightKnowledge.forEach((dkZone) => {
            if (dkZone === null) {
                data.push(null);
                return;
            }

            const zoneData: ZoneData = {
                have: 0,
                total: 0,
                items: [],
            };

            for (const professionId of dkZone.masters) {
                if (character.professions?.[professionId]) {
                    const profData = dragonflightProfessionMap[professionId];

                    zoneData.items.push({
                        have: userQuestStore.hasAny(character.id, profData.masterQuestId),
                        itemId: -1,
                        profession: professionId,
                    });
                }
            }

            for (const profData of dragonflightProfessions) {
                if (!character.professions?.[profData.id]) {
                    continue;
                }

                if (dkZone.name.endsWith('Books')) {
                    const bookQuests = (profData.bookQuests || []).filter(
                        (bq) =>
                            (['LN', 'ZCB'].indexOf(bq.source) >= 0 && dkZone.shortName === 'ZC') ||
                            bq.source.startsWith(`${dkZone.shortName} `)
                    );

                    const characterRenown = dkZone.reputationId
                        ? Math.floor((character.reputations?.[dkZone.reputationId] ?? 0) / 2500)
                        : 0;

                    for (const bookQuest of orderBy(
                        bookQuests,
                        (bq) => wowthingData.items.items[bq.itemId].name
                    )) {
                        const bookData = {
                            have: userQuestStore.hasAny(character.id, bookQuest.questId),
                            itemId: bookQuest.itemId,
                            profession: profData.id,
                            source: bookQuest.source,
                        };

                        const requiredRenown = parseInt(bookQuest.source.split(' ')[1]);
                        if (!bookData.have) {
                            if (!isNaN(requiredRenown) && requiredRenown <= characterRenown) {
                                zoneData.status = 'fail';
                            } else if (
                                bookData.source.startsWith('AC ') ||
                                bookData.source === 'LN'
                            ) {
                                zoneData.status = 'fail';
                            }
                        }

                        zoneData.items.push(bookData);
                    }
                } else {
                    // not books
                    const treasureQuests = (profData.treasureQuests || []).filter(
                        (tq) => tq.source === dkZone.shortName
                    );
                    for (const treasureQuest of treasureQuests) {
                        zoneData.items.push({
                            have: userQuestStore.hasAny(character.id, treasureQuest.questId),
                            itemId: treasureQuest.itemId,
                            profession: profData.id,
                        });
                    }
                }
            }

            zoneData.have = zoneData.items.filter((item) => item.have).length;
            zoneData.total = zoneData.items.length;
            zoneData.items.sort((a, b) =>
                Profession[a.profession].localeCompare(Profession[b.profession])
            );

            if (dkZone.name.endsWith('Books')) {
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

            data.push(zoneData);
        });
    }
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
{#each dragonflightKnowledge as dk, dkIndex}
    {#if dk === null}
        <td class="spacer"></td>
    {:else}
        {@const zoneData = data[dkIndex]}
        {#if zoneData.items.length > 0}
            <td
                class="profession-knowledge status-{zoneData.status}"
                use:componentTooltip={{
                    component: Tooltip,
                    props: {
                        character,
                        reputationId: dk.reputationId,
                        zoneData,
                        zoneName: dk.name,
                    },
                }}
            >
                {zoneData.have} / {zoneData.total}
            </td>
        {:else}
            <td class="profession-knowledge faded">---</td>
        {/if}
    {/if}
{/each}
