<script lang="ts">
    import { honorAchievements } from '@/data/achievements';
    import { CriteriaTreeOperator } from '@/enums/wow';
    import { achievementStore, userAchievementStore, userQuestStore } from '@/stores';
    import { achievementState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import { getAchievementStatus } from '@/utils/achievements';
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm';
    import type { AchievementDataAchievement } from '@/types';

    import CriteriaTree from './CriteriaTree.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    export let achievement: AchievementDataAchievement;

    $: data = getAchievementStatus(
        $achievementStore,
        $userAchievementStore,
        $userQuestStore,
        achievement
    );

    $: rootCriteriaTree = $achievementStore.criteriaTree[achievement.criteriaTreeId];

    let oof: [number, number][];
    $: {
        oof = data.criteriaCharacters[data.criteriaTrees[0]?.[0]?.criteriaId];
        if (oof?.length === 0) {
            oof = data.criteriaCharacters[rootCriteriaTree.criteriaId];
        }
    }

    let progressBar: boolean;
    let barAmount: number;
    $: {
        if (rootCriteriaTree) {
            progressBar =
                achievement?.isProgressBar ||
                data.rootCriteriaTree?.isProgressBar ||
                (data.oneCriteria && data.criteriaTrees[0][0].isProgressBar) ||
                false;

            if (data.oneCriteria) {
                if (rootCriteriaTree.operator === CriteriaTreeOperator.SumChildren) {
                    barAmount = rootCriteriaTree.amount;
                } else {
                    barAmount = data.criteriaTrees[0][0].amount;
                }
            } else {
                barAmount = rootCriteriaTree.amount;
            }
        }
    }

    let selectedCharacterId: number;
    $: {
        if (!selectedCharacterId) {
            selectedCharacterId = data.characterCounts[0]?.[0] || 0;
        }

        if (achievement.id === 14158) {
            //console.log({achievement, criteriaTree: rootCriteriaTree, data})
        }
    }
</script>

<style lang="scss">
    .criteria {
        border-top: 1px dashed var(--border-color);
        display: grid;
        grid-area: criteria;
        grid-template-columns: 1fr 1fr;
        margin-top: 0.5rem;
        padding-top: 0.25rem;
        width: 100%;

        &:empty {
            display: none;
        }

        :global(.progress-container:only-child) {
            grid-column: 1 / 3;
        }
    }

    .progress {
        grid-area: progress;
        margin-top: 0.75rem;

        & :global(.progress-container:nth-child(n + 2)) {
            margin-top: 0.3rem;
        }
    }
</style>

{#if rootCriteriaTree}
    <div class="criteria">
        {#if honorAchievements[achievement.id]}
            <ProgressBar
                title="Honor Level"
                have={userState.general.honorLevel || 0}
                total={$achievementStore.criteria[data.criteriaTrees[0][0].criteriaId]?.asset || 0}
            />
        {:else if progressBar}
            <ProgressBar
                title={data.rootCriteriaTree.description}
                have={oof?.[0]?.[1] || 0}
                total={barAmount}
            />
        {:else}
            {#each rootCriteriaTree.children as child}
                <CriteriaTree
                    characterId={selectedCharacterId}
                    criteriaCharacters={data.criteriaCharacters}
                    criteriaTreeId={child}
                    isReputation={data.reputation}
                    {achievement}
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>

    {#if !achievement.isAccountWide || data.reputation}
        {@const characters = data.characterCounts.slice(
            0,
            $achievementState.showAllCharacters ? 9999 : 3
        )}
        {#if characters.length > 0}
            <div class="progress">
                {#each characters.filter(([charId]) => userState.general.characterById[charId]) as [characterId, count]}
                    {@const selected = selectedCharacterId === characterId}
                    <ProgressBar
                        on:click={() => (selectedCharacterId = characterId)}
                        title={getCharacterNameRealm(characterId)}
                        have={count}
                        textCls={selected ? 'status-success' : null}
                        total={data.total}
                        {selected}
                    />
                {/each}
            </div>
        {/if}
    {/if}
{/if}
