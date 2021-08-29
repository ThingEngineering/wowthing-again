<script lang="ts">
    import { achievementStore } from '@/stores'
    import type {AchievementDataAchievement, AchievementDataCriteriaTree} from '@/types'
    import { AchievementDataAccount, getAchievementDataAccount } from '@/utils/get-achievement-data-account'

    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let achievement: AchievementDataAchievement

    let criteriaTree: AchievementDataCriteriaTree
    let data: AchievementDataAccount
    let progressBar: boolean
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[achievement.criteriaTreeId]
        data = getAchievementDataAccount(criteriaTree)

        progressBar = achievement.isProgressBar || data.criteria[0].isProgressBar

        if (achievement.id === 12866) {
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
</style>

{#if criteriaTree}
    <div>
        {#if progressBar}
            <ProgressBar
                title="{data.criteria[0].description}"
                have={data.have[data.criteria[0].id]}
                total={data.criteria[0].amount}
            />
        {:else}
            hello
            {#each criteriaTree.children as child}
                <AchievementCriteriaTree {achievement} criteriaTreeId={child} />
            {/each}
        {/if}
    </div>
{/if}
