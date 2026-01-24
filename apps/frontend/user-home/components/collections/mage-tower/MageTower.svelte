<script lang="ts">
    import { classOrder } from '@/data/character-class';
    import { userAchievementStore } from '@/stores';
    import { UserCount } from '@/types/user-count';
    import { userState } from '@/user-home/state/user';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import { mageTowerByClass, MageTowerChallenge, mageTowerChallengeOrder } from './data';

    import ClassRow from './ClassRow.svelte';
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';

    let data: [number, [number, boolean][]][] = $derived(
        classOrder
            .filter((classId) => mageTowerByClass[classId])
            .map((classId) => {
                const challenges = getNumberKeyedEntries(mageTowerByClass[classId]);
                const validCharacters = userState.general.activeCharacters.filter(
                    (c) => c.classId === classId
                );
                return [
                    classId,
                    mageTowerChallengeOrder.map((challenge) => {
                        const [specIndex, criteriaIndex] =
                            challenges.find(([, v]) => v === challenge) || [];
                        return [
                            specIndex,
                            specIndex !== undefined &&
                                validCharacters.some(
                                    (char) =>
                                        $userAchievementStore.addonAchievements[char.id]?.[15309]
                                            ?.criteria?.[criteriaIndex - 1]
                                ),
                        ];
                    }),
                ];
            })
    );
    let overallHave = $derived(
        data
            .map(([, classData]) => classData.filter(([, has]) => has).length)
            .reduce((a, b) => a + b, 0)
    );
    let overallTotal = $derived(
        data
            .map(
                ([, classData]) => classData.filter(([specIndex]) => specIndex !== undefined).length
            )
            .reduce((a, b) => a + b, 0)
    );
</script>

<style lang="scss">
    th {
        padding: 0.3rem 0.5rem;
        text-align: center;

        :global(> span) {
            font-size: 100%;
            margin-left: 0;
        }
    }
</style>

<table class="table table-striped">
    <thead>
        <tr>
            <th>
                <CollectibleCount counts={new UserCount(overallHave, overallTotal)} />
            </th>
            {#each mageTowerChallengeOrder as challenge, challengeIndex (challenge)}
                {@const have = data.filter(([, classData]) => classData[challengeIndex][1]).length}
                {@const total = data.filter(
                    ([, classData]) => classData[challengeIndex][0] !== undefined
                ).length}
                <th class="b-l">
                    {MageTowerChallenge[challenge]}
                    <br />
                    <CollectibleCount counts={new UserCount(have, total)} />
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as [classId, classData] (classId)}
            <ClassRow {classId} {classData} />
        {/each}
    </tbody>
</table>
