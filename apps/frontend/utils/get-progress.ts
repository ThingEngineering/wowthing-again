import find from 'lodash/find';

import { covenantFeatureOrder, covenantMap } from '@/data/covenant';
import { factionIdMap } from '@/data/faction';
import { garrisonBuildingIcon, garrisonTrees, garrisonUnlockQuests } from '@/data/garrison';
import { ProgressDataType } from '@/enums/progress-data-type';
import { QuestStatus } from '@/enums/quest-status';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';
import { toNiceNumber } from '@/utils/formatting';
import type {
    Character,
    CharacterShadowlandsCovenant,
    CharacterShadowlandsCovenantFeature,
    UserAchievementDataAddonAchievement,
} from '@/types';
import type {
    ManualDataProgressCategory,
    ManualDataProgressData,
    ManualDataProgressGroup,
} from '@/types/data/manual';

export default function getProgress(
    character: Character,
    category: ManualDataProgressCategory,
    group: ManualDataProgressGroup,
    countAccountWide = true
): ProgressInfo {
    let have = 0;
    let missingRequired = false;
    let showCurrency = 0;
    let total = 0;
    let icon = '';
    const showReputation = 0;

    let datas: ManualDataProgressData[];
    const descriptionText: Record<number, string> = {};
    const haveIndexes: number[] = [];
    const nameOverride: Record<number, string> = {};

    let skipRequiredQuests = false;
    if (category.name === 'Garrisons' && group.name === 'Pet Quest') {
        const garrison = character.garrisons?.[2];
        if (garrison?.level === 3) {
            skipRequiredQuests = true;
        }
    }

    if (
        character.level >= (category.minimumLevel || 0) &&
        character.level >= (group.minimumLevel || 0) &&
        (skipRequiredQuests ||
            ((category.requiredQuestIds.length === 0 ||
                checkCharacterQuestIds(character.id, category.requiredQuestIds)) &&
                ((group.requiredQuestIds?.length || 0) === 0 ||
                    checkCharacterQuestIds(character.id, group.requiredQuestIds))))
    ) {
        if (group.type === 'dragon-racing') {
            datas = [];
            for (const data of group.data[0]) {
                const times = data.description.split(' ').map((n) => parseInt(n) * 1000);
                const bestTime = character.currencies?.[data.ids[0]]?.quantity || 0;

                if (bestTime === 0 || bestTime > times[0]) {
                    datas.push({
                        ids: data.ids,
                        name: `:bronze-medal: ${data.name}`,
                        type: data.type,
                        value: 999999,
                    });
                } else {
                    have++;
                }

                if (bestTime === 0 || bestTime > times[1]) {
                    datas.push({
                        ids: data.ids,
                        name: `:silver-medal: ${data.name}`,
                        type: data.type,
                        value: times[0],
                    });
                } else {
                    have++;
                }

                datas.push({
                    ids: data.ids,
                    name: `:gold-medal: ${data.name}`,
                    type: data.type,
                    value: times[1],
                });
            }
        } else if (group.type === 'campaign') {
            datas = [];
            const lookupKey = group.lookup === 'faction' ? factionIdMap[character.faction] : 0;
            const campaign = wowthingData.static.campaignById.get(group.data[lookupKey][0].ids[0]);

            for (const questLineId of campaign.questLineIds) {
                const questLine = wowthingData.static.questLineById.get(questLineId);
                if (!questLine) {
                    console.warn('bad questLine?', campaign.id, questLineId);
                    return;
                }

                datas.push({
                    ids: questLine.questIds,
                    name: questLine.name,
                    type: ProgressDataType.Quest,
                    value: questLine.questIds.length,
                });
                // descriptionText[index] = `${haveQuests} / ${totalQuests}`;
            }
        } else if (group.type === 'questline') {
            datas = [];
            const lookupKey = group.lookup === 'faction' ? factionIdMap[character.faction] : 0;

            for (const thing of group.data[lookupKey]) {
                const questLine = wowthingData.static.questLineById.get(thing.ids[0]);
                if (!questLine) {
                    console.warn('bad questLine?', thing.ids);
                    return;
                }

                datas.push({
                    ids: questLine.questIds,
                    name: questLine.name,
                    type: ProgressDataType.Quest,
                    value: questLine.questIds.length,
                });
            }
        } else {
            switch (group.lookup) {
                case 'class':
                    //(c) => some(drop.limit.slice(1), (cl) => classSlugMap[cl].id === c.classId)
                    datas =
                        group.data[
                            wowthingData.static.characterClassById.get(character.classId).slug
                        ];
                    break;

                case 'covenant':
                    datas = group.data[character.shadowlands?.covenantId];
                    if (datas) {
                        icon = covenantMap[character.shadowlands.covenantId].icon;
                    }
                    break;

                case 'faction':
                    datas = group.data[factionIdMap[character.faction]];
                    break;

                default:
                    datas = group.data[0];
                    break;
            }
        }

        if (datas) {
            if (group.type === 'dragon-racing') {
                total = group.data[0].reduce((a, b) => a + 1 + b.description.split(' ').length, 0);
            } else if (datas[0].type === ProgressDataType.GarrisonTree) {
                total = datas.reduce((a, b) => a + b.value, 0);
            } else {
                total = datas.filter(
                    (data) =>
                        data.name !== 'separator' &&
                        (countAccountWide || data.type !== ProgressDataType.AccountQuest)
                ).length;
            }

            for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
                const data = datas[dataIndex];
                if (data.name === 'separator') {
                    continue;
                }

                if (['accountQuest', 'quest'].includes(group.type) && !data.name) {
                    nameOverride[dataIndex] =
                        wowthingData.static.questNameById.get(data.ids[0]) ||
                        `Quest #${data.ids[0]}`;
                }

                let haveThis = false;
                if (
                    (group.type === 'quest' && checkCharacterQuestIds(character.id, data.ids)) ||
                    (group.type === 'accountQuest' && checkAccountQuestIds(data.ids))
                ) {
                    haveThis = true;

                    if (group.name === 'Brewfest Intro Quests') {
                        showCurrency = 1037829; // Cyphers of the First Ones
                    }
                } else if (group.type === 'campaign' || group.type === 'questline') {
                    const haveQuests = data.ids.filter((questId) =>
                        userState.quests.characterById.get(character.id)?.hasQuestById?.has(questId)
                    ).length;
                    haveThis = haveQuests === data.ids.length;

                    descriptionText[dataIndex] = `${haveQuests} / ${data.ids.length}`;
                } else if (group.type === 'item') {
                    haveThis = data.ids.some((id) => character.getItemCount(id) > 0);
                } else if (group.type === 'dragon-racing') {
                    const bestTime = character.currencies?.[data.ids[0]]?.quantity || 0;
                    if (bestTime > 0) {
                        haveThis = bestTime <= data.value;
                        if (data.value < 999999) {
                            descriptionText[dataIndex] =
                                `${Math.floor(bestTime / 1000)}.${bestTime % 1000}s / ${data.value / 1000}s`;
                        } else {
                            descriptionText[dataIndex] =
                                `${Math.floor(bestTime / 1000)}.${bestTime % 1000}s`;
                        }
                    } else if (data.value < 999999) {
                        descriptionText[dataIndex] = `${data.value / 1000}s`;
                    }
                } else if (group.type === 'mixed') {
                    switch (data.type) {
                        case ProgressDataType.Achievement: {
                            haveThis = userState.achievements.achievementEarnedById.has(
                                data.ids[0]
                            );
                            break;
                        }

                        case ProgressDataType.AddonAchievement: {
                            const cheev: UserAchievementDataAddonAchievement = null;
                            // FIXME addonAchievements
                            // userAchievementData?.addonAchievements?.[character.id]?.[
                            //     data.ids[0]
                            // ];
                            if (cheev) {
                                if (cheev.earned) {
                                    haveThis = true;
                                } else if (data.ids.length === 2) {
                                    haveThis =
                                        (cheev.criteria?.[data.ids[1]] || 0) >= (data.value || 1);
                                } else if (data.description && data.value) {
                                    // TODO do this properly
                                    let have = 0;
                                    if (data.ids[0] === 11160) {
                                        have = (cheev.criteria || []).reduce(
                                            (a, b) => a + Math.min(1, b),
                                            0
                                        );
                                    } else {
                                        have = (cheev.criteria || []).reduce((a, b) => a + b, 0);
                                    }

                                    descriptionText[dataIndex] = data.description
                                        .replace('%1', have.toString())
                                        .replace('%2', data.value.toString());
                                }
                            } else if (data.description && data.value) {
                                descriptionText[dataIndex] = data.description
                                    .replace('%1', have.toString())
                                    .replace('%2', data.value.toString());
                            }
                            break;
                        }

                        case ProgressDataType.Always: {
                            haveThis = true;
                            break;
                        }

                        case ProgressDataType.Criteria: {
                            const criteria = (
                                userState.achievements.criteriaById.get(data.ids[0]) || []
                            ).filter(([characterId]) => characterId === character.id);
                            haveThis = criteria.length === 1 && criteria[0][1] >= (data.value || 1);
                            break;
                        }

                        case ProgressDataType.HonorLevel: {
                            haveThis = userState.general.honorLevel >= data.value;
                            break;
                        }

                        case ProgressDataType.Quest: {
                            haveThis = checkCharacterQuestIds(character.id, data.ids);
                            nameOverride[dataIndex] =
                                wowthingData.static.questNameById.get(data.ids[0]) ||
                                data.name ||
                                `Quest #${data.ids[0]}`;
                            break;
                        }

                        case ProgressDataType.AccountQuest: {
                            haveThis = checkAccountQuestIds(data.ids);
                            nameOverride[dataIndex] =
                                wowthingData.static.questNameById.get(data.ids[0]) ||
                                data.name ||
                                `Quest #${data.ids[0]}`;
                            break;
                        }

                        case ProgressDataType.SpentCyphers: {
                            showCurrency = 1979; // Cyphers of the First Ones
                            const spent = getSpentCyphers(character);
                            haveThis = spent >= (data.value || 0);
                            if (!haveThis) {
                                descriptionText[dataIndex] =
                                    `${toNiceNumber(spent)} / ${toNiceNumber(data.value)}`;
                            }
                            break;
                        }

                        case ProgressDataType.AddonQuest: {
                            const quest = userState.quests.characterById
                                .get(character.id)
                                ?.progressQuestByKey?.get(`q${data.value}`);
                            if (quest) {
                                haveThis = quest.status === QuestStatus.Completed;
                                have = haveThis
                                    ? total - 1
                                    : quest.objectives.reduce((a, b) => a + b.have, 0);
                            }
                            break;
                        }

                        case ProgressDataType.GarrisonTree: {
                            const talent = character.garrisonTrees?.[data.ids[0]]?.[data.ids[1]];
                            if (talent?.[0] > 0) {
                                have += data.value - 1;
                                haveThis = talent[0] >= data.value;
                            }

                            descriptionText[dataIndex] = `Rank ${talent?.[0] || 0}/${data.value}`;
                            showCurrency = 1904; // Tower Knowledge

                            break;
                        }

                        case ProgressDataType.SlCovenant: {
                            const covenant =
                                character.shadowlands?.covenants?.[
                                    data.ids[0] === 0
                                        ? character.shadowlands?.covenantId
                                        : data.ids[0]
                                ];
                            if (
                                covenant &&
                                (covenant.conductor?.rank > 0 ||
                                    covenant.missions?.rank > 0 ||
                                    covenant.transport?.rank > 0 ||
                                    covenant.unique?.rank > 0)
                            ) {
                                const [featureKey, , featureMaxRank] =
                                    covenantFeatureOrder[data.value - 1];
                                const charBuilding = covenant[
                                    featureKey as keyof CharacterShadowlandsCovenant
                                ] as CharacterShadowlandsCovenantFeature;

                                if (data.ids[0] === 0) {
                                    icon = covenantMap[character.shadowlands.covenantId].icon;
                                }

                                have = charBuilding?.rank || 0;

                                if (charBuilding?.researchEnds > 0) {
                                    // const ends: DateTime = DateTime.fromSeconds(charBuilding.researchEnds)
                                    // if (ends <= now) {
                                    have++;
                                    // }
                                    // else {
                                    //     const duration = toNiceDuration(ends.diff($timeStore).toMillis())
                                    //     return `${feature.rank + 1} in<br><span class="status-shrug">${duration}</span>`
                                    // }
                                }

                                total = featureMaxRank;
                                descriptionText[dataIndex] = `Rank ${have}/${total}`;
                            } else {
                                have = -1;
                                total = -1;
                            }
                            break;
                        }

                        case ProgressDataType.WodGarrison: {
                            const garrison = character.garrisons?.[2];

                            // Garrison level
                            if (data.value === undefined) {
                                if (garrison?.level > 0) {
                                    have = garrison.level;
                                    total = 3;
                                } else {
                                    if (
                                        checkCharacterQuestIds(character.id, garrisonUnlockQuests)
                                    ) {
                                        total = 3;
                                    } else {
                                        have = -1;
                                        total = 0;
                                    }
                                }
                            } else if (garrison) {
                                const building = find(
                                    garrison.buildings,
                                    (building) => building.plotId === data.ids[0]
                                );

                                if (building) {
                                    have = building.rank;
                                    total = 3;
                                    descriptionText[dataIndex] = `Rank ${have}`;
                                    icon = garrisonBuildingIcon[building.buildingId];
                                    nameOverride[dataIndex] = building.name;
                                } else {
                                    if (garrison.level >= data.value) {
                                        have = -1;
                                    }
                                    total = 0;
                                }
                            } else {
                                total = 0;
                            }
                        }
                    }
                }

                if (haveThis) {
                    haveIndexes.push(dataIndex);
                    if (countAccountWide || data.type !== ProgressDataType.AccountQuest) {
                        have++;
                    }
                } else if (!haveThis && data.required === true) {
                    missingRequired = true;
                }
            }
        }
    }

    return {
        datas,
        descriptionText,
        have,
        haveIndexes,
        icon,
        missingRequired,
        nameOverride,
        showCurrency,
        showReputation,
        total,
    };
}

function checkAccountQuestIds(questIds: number[]) {
    return questIds.some((questId) => userState.quests.anyCharacterHasQuestId.has(questId));
}

function checkCharacterQuestIds(characterId: number, questIds: number[]) {
    return questIds.some((id) =>
        userState.quests.characterById.get(characterId)?.hasQuestById?.has(id)
    );
}

function getSpentCyphers(character: Character): number {
    const characterTree = character.garrisonTrees?.[garrisonTrees.cypherResearch.id];
    if (characterTree) {
        let total = 0;
        for (const tier of garrisonTrees.cypherResearch.tiers) {
            for (const talent of tier) {
                if (talent === null) {
                    continue;
                }

                const rank = characterTree[talent.id]?.[0] || 0;
                for (let i = 0; i < rank; i++) {
                    total += talent.costs[i];
                }
            }
        }
        return total;
    }
    return 0;
}

export interface ProgressInfo {
    datas: ManualDataProgressData[];
    descriptionText: Record<number, string>;
    have: number;
    haveIndexes: number[];
    icon: string;
    missingRequired: boolean;
    nameOverride: Record<number, string>;
    showCurrency: number;
    showReputation: number;
    total: number;
}
