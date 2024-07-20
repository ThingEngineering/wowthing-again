<script lang="ts">
    import { honorAchievements } from '@/data/achievements'
    import { achievementStore, userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { AchievementDataAccount, getAccountData } from '@/utils/achievements'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let achievement: AchievementDataAchievement

    let criteriaTree: AchievementDataCriteriaTree
    let data: AchievementDataAccount
    let progressBar: boolean
    $: {
        criteriaTree = $achievementStore.criteriaTree[achievement.criteriaTreeId]
        data = getAccountData(
            $achievementStore,
            $userAchievementStore,
            $userStore,
            $userQuestStore,
            achievement
        )

        progressBar = achievement?.isProgressBar || data.criteria[0]?.isProgressBar || false

        if (achievement.id === 13764) {
            console.log('-- ACCOUNT --')
            console.log(achievement)
            console.log(criteriaTree)
            console.log(data)
        }
    }
</script>

<style lang="scss">
    div {
        grid-area: criteria;
        margin-top: 0.5rem;
        padding-top: 0.25rem;
        width: 100%;
    }
    .tree {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
</style>

{#if criteriaTree}
    <div
        class:tree={!honorAchievements[achievement.id] && !progressBar}
    >
        {#if honorAchievements[achievement.id]}
            <ProgressBar
                title="Honor Level"
                have={$userStore.honorLevel || 0}
                total={$achievementStore.criteria[data.criteria[0].criteriaId].asset}
            />
        {:else if progressBar}
            <ProgressBar
                title="{data.criteria[0].description}"
                have={data.have[data.criteria[0].id]}
                total={data.criteria[0].amount}
            />
        {:else}
            {#each criteriaTree.children as child}
                <AchievementCriteriaTree
                    {achievement}
                    accountWide={true}
                    criteriaTreeId={child}
                    haveMap={data.have}
                    rootCriteriaTree={criteriaTree}
                />
            {/each}
        {/if}
    </div>
{/if}
