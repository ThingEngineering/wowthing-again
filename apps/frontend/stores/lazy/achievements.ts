import { CriteriaType } from '@/enums/criteria-type';
import { UserCount } from '@/types';
import type { AchievementsState } from '../local-storage';
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCategory,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    UserAchievementData,
    UserData,
} from '@/types';
import type { UserQuestData } from '@/types/data';

interface LazyStores {
    achievementState: AchievementsState;
    achievementData: AchievementData;
    userAchievementData: UserAchievementData;
    userData: UserData;
    userQuestData: UserQuestData;
}

export class LazyAchievements {
    public categories: Record<number, ComputedCategory> = {};
    public points: Record<string, UserCount> = {};
    public stats: Record<string, UserCount> = {};
}

export class ComputedCategory {
    public achievements: ComputedAchievement[] = [];

    constructor(public category: AchievementDataCategory) {}
}

export class ComputedAchievement {
    public characters: Record<number, [number, number][]> = {};
    public criteriaTrees: AchievementDataCriteriaTree[] = [];
    public earned: boolean;

    constructor(
        public achievementId: number,
        public achievement: AchievementDataAchievement,
    ) {}
}

export function doAchievements(stores: LazyStores): LazyAchievements {
    console.time('doAchievements');

    const processor = new AchievementProcessor(stores);
    return processor.process();
}

class AchievementProcessor {
    private data: LazyAchievements = new LazyAchievements();
    private stores: LazyStores;

    constructor(stores: LazyStores) {
        this.stores = stores;
    }

    process(): LazyAchievements {
        console.time('AchievementProcessor.process');

        const overallPoints = (this.data.points['OVERALL'] = new UserCount());
        const overallStats = (this.data.stats['OVERALL'] = new UserCount());

        for (const category of this.stores.achievementData.categories.filter((cat) => !!cat)) {
            this.processCategory(category);

            for (const childCategory of category.children) {
                this.processCategory(childCategory, category);
            }
        }

        console.timeEnd('AchievementProcessor.process');
        return this.data;
    }

    private processCategory(
        dataCategory: AchievementDataCategory,
        parent?: AchievementDataCategory,
    ) {
        if (!dataCategory) {
            return;
        }

        const { achievementData, userAchievementData, userData } = this.stores;

        const category = (this.data.categories[dataCategory.id] = new ComputedCategory(
            dataCategory,
        ));

        const catKey = parent ? `${parent.slug}--${dataCategory.slug}` : dataCategory.slug;
        const catPoints = (this.data.points[catKey] = new UserCount());
        const catStats = (this.data.stats[catKey] = new UserCount());

        for (const achievementId of dataCategory.achievementIds) {
            const dataAchievement = achievementData.achievement[achievementId];

            const achievement = new ComputedAchievement(achievementId, dataAchievement);
            category.achievements.push(achievement);

            achievement.earned = userAchievementData.achievements[achievementId] !== undefined;

            catPoints.total += dataAchievement.points;
            catStats.total++;

            if (achievement.earned) {
                catPoints.have += dataAchievement.points;
                catStats.have++;
            }

            const rootCriteriaTree = achievementData.criteriaTree[dataAchievement.criteriaTreeId];
            if (!rootCriteriaTree) {
                continue;
            }

            for (const childId of rootCriteriaTree.children) {
                const childTree = achievementData.criteriaTree[childId];
                if (!childTree) {
                    console.log('Invalid child tree', dataAchievement, childId);
                    continue;
                }

                achievement.criteriaTrees.push(childTree);
                achievement.characters[childId] = [];

                const criteria = achievementData.criteria[childTree?.criteriaId || 0];
                if (!criteria) {
                    // console.log('Invalid criteria', dataAchievement, childTree);
                    continue;
                }

                if (dataAchievement.isAccountWide) {
                    this.criteriaAccount(achievement, childTree, criteria);
                } else {
                    // this.criteriaCharacter(achievement, childTree, criteria);
                }
            }

            // console.log(dataAchievement, rootCriteriaTree);

            // data = getAccountData(
            //     $achievementStore,
            //     $userAchievementStore,
            //     $userStore,
            //     achievement,
            // );

            // progressBar = achievement?.isProgressBar || data.criteria[0]?.isProgressBar || false;
        }
    }

    private criteriaAccount(
        achievement: ComputedAchievement,
        criteriaTree: AchievementDataCriteriaTree,
        criteria: AchievementDataCriteria,
    ) {
        const { achievementData, userAchievementData, userData } = this.stores;
        const data = achievement.characters[criteriaTree.id];

        if (criteria.type === CriteriaType.EarnAchievement) {
            data.push([0, userAchievementData.achievements[criteria.asset] ? 1 : 0]);
            // } else if (
            //     criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny &&
            //     forceGarrisonTalent[childId]
            // ) {
            //     const [talentId, minRank] = forceGarrisonTalent[childId];
            //     for (const character of userData.characters) {
            //         for (const garrisonTree of Object.values(character.garrisonTrees || {})) {
            //             if (garrisonTree[talentId]) {
            //                 if (garrisonTree[talentId]?.[0] >= minRank) {
            //                     ret.have[childId] = 1;
            //                 }
            //                 break;
            //             }
            //         }
            //     }
        } else if (criteria.type === CriteriaType.RaiseSkillLine) {
            for (const character of userData.characters) {
                for (const subProfessions of Object.values(character.professions || {})) {
                    const subProfession = subProfessions[criteria.asset];
                    if (subProfession?.currentSkill >= criteriaTree.amount) {
                        data.push([0, 1]);
                        break;
                    }
                }
            }

            if (data.length === 0) {
                data.push([0, 0]);
            }
        } else if (criteria?.type === CriteriaType.HonorMaybe) {
            data.push([0, userData.honorLevel || 0]);
        } else {
            const value: number[] = (userAchievementData.criteria[criteriaTree.id] || [[]])[0];
            if (achievement.achievementId === 7380) console.log(criteriaTree, criteria, value);
            // ret.have[childId] = value[1] || 0;

            // if (ret.have[childId] === 0) {
            //     for (const childChild of childTree.children) {
            //         const value: number[] = (userAchievementData.criteria[childChild] || [[]])[0];
            //         ret.have[childId] = value[1] || 0;
            //     }
            // }
        }
    }
}
