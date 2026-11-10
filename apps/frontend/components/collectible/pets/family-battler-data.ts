import { familyBattlerAchievements } from '@/data/achievements';
import { CriteriaTreeOperator } from '@/enums/wow';
import { wowthingData } from '@/shared/stores/data';
import { AchievementDataCriteriaTree, UserCount } from '@/types';
import { userState } from '@/user-home/state/user';

type AchievementRow = { name: string; stats: UserCount; userHas: boolean[] };
export class FamilyBattlerData {
    public columns: UserCount[] = [];
    public rows: AchievementRow[] = [];
    public stats = new UserCount();

    constructor(
        public name: string,
        public familyBattle: (typeof familyBattlerAchievements)[0]
    ) {}
}

export function generateFamilyBattlerData() {
    const ret: Record<string, FamilyBattlerData> = {};

    for (const familyBattle of familyBattlerAchievements) {
        const achievement = wowthingData.achievements.achievementById.get(
            familyBattle.achievementId
        );

        const data = (ret[familyBattle.slug] = new FamilyBattlerData(
            achievement.name,
            familyBattle
        ));

        const criteriaTree = wowthingData.achievements.criteriaTreeById.get(
            achievement?.criteriaTreeId
        );

        const childCriteriaTrees: [AchievementDataCriteriaTree, AchievementDataCriteriaTree[]][] =
            [];
        for (const childCriteriaTreeId of criteriaTree?.children || []) {
            const childStats = new UserCount();
            data.columns.push(childStats);

            const childCriteriaTree =
                wowthingData.achievements.criteriaTreeById.get(childCriteriaTreeId);
            const childCriteria = wowthingData.achievements.criteriaById.get(
                childCriteriaTree?.criteriaId
            );
            const childAchievement = wowthingData.achievements.achievementById.get(
                childCriteria?.asset
            );
            const childAchievementCriteriaTree = wowthingData.achievements.criteriaTreeById.get(
                childAchievement?.criteriaTreeId
            );
            const childAchievementCriteriaTreeChildren = (
                childAchievementCriteriaTree?.children || []
            ).map((criteriaTreeId) =>
                wowthingData.achievements.criteriaTreeById.get(criteriaTreeId)
            );

            if (childAchievementCriteriaTree.operator === CriteriaTreeOperator.All) {
                childStats.total += childAchievementCriteriaTree.children.length;
            } else if (childAchievementCriteriaTree.operator === CriteriaTreeOperator.Any) {
                childStats.total += childAchievementCriteriaTree.amount;
            } else {
                console.log('???', childAchievementCriteriaTree);
            }

            childCriteriaTrees.push([
                childAchievementCriteriaTree,
                childAchievementCriteriaTreeChildren,
            ]);
        }

        for (const firstChildTree of childCriteriaTrees[0][1]) {
            const row: AchievementRow = {
                name: firstChildTree.description,
                stats: new UserCount(),
                userHas: [],
            };
            data.rows.push(row);
        }

        const hasAchievement = !!userState.achievements.achievementEarnedById.get(achievement.id);

        for (let childIndex = 0; childIndex < childCriteriaTrees.length; childIndex++) {
            const [, childTrees] = childCriteriaTrees[childIndex];
            const childStats = data.columns[childIndex];

            if (!hasAchievement) {
                data.stats.total += childStats.total;
            }

            for (let treeIndex = 0; treeIndex < childTrees.length; treeIndex++) {
                const row = data.rows[treeIndex];
                const childTree = childTrees[treeIndex];
                const userHm = userState.achievements.criteriaById.get(childTree.id);
                const hasCriteria = !!userHm;
                row.userHas.push(hasCriteria);

                row.stats.total++;

                if (hasCriteria) {
                    childStats.have++;
                    row.stats.have++;
                }

                if (hasAchievement) {
                    data.stats.total++;
                    data.stats.have++;
                } else if (hasCriteria) {
                    data.stats.have++;
                }
            }
        }
    }

    return ret;
}
