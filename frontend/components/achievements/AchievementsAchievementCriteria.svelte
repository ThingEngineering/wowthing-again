<script lang="ts">
    import { achievementStore } from '@/stores'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'

    export let achievement: AchievementDataAchievement

    let criteriaTree: AchievementDataCriteriaTree
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[achievement.criteriaTreeId]

        console.log(achievement)
        console.log(criteriaTree)
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
        {#each criteriaTree.children as child}
            <AchievementCriteriaTree criteriaTreeId={child} />
        {/each}
    </div>
{/if}
