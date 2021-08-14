<script lang="ts">
    import { achievementStore } from '@/stores'
    import type {AchievementDataAchievement, AchievementDataCriteriaTree, Dictionary} from '@/types'
    import {AchievementDataAccount, getAchievementDataAccount} from '@/utils/get-achievement-data-account'

    import AchievementCriteriaBar from './AchievementsAchievementCriteriaBar.svelte'
    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'

    export let achievement: AchievementDataAchievement

    let criteriaTree: AchievementDataCriteriaTree
    let data: AchievementDataAccount
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[achievement.criteriaTreeId]
        data = getAchievementDataAccount(criteriaTree)

        if (achievement.id === 5363) {
            console.log('-- CHARACTER --')
            console.log(achievement)
            console.log(criteriaTree)
        }
    }
</script>

<style lang="scss">
    div {
        border-top: 1px dashed $border-color;
        grid-area: criteria;
        margin-top: 0.5rem;
        padding-top: 0.25rem;
        width: 100%;
    }
</style>

{#if criteriaTree}
    <div>
        {#if criteriaTree.children.length === 1}
            {#if achievement.isProgressBar}
                <AchievementCriteriaBar {achievement} />
            {/if}
        {:else}
            {#each criteriaTree.children as child}
                <AchievementCriteriaTree {achievement} criteriaTreeId={child} />
            {/each}
        {/if}
    </div>
{/if}
