<script lang="ts">
    import { achievementStore, userAchievementStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class';
    import type { AchievementDataCategory } from '@/types'

    import AchievementsAchievement from './Achievement.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    let categories: AchievementDataCategory[]
    $: {
        categories = []
        for (const category of $achievementStore.categories) {
            if (category === null) {
                break
            }
            categories.push(category)
        }
    }
</script>

<style lang="scss">
    .summary {
        width: 100%;

        @media screen and (min-width: 1600px) {
            align-items: flex-start;
            column-gap: 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
    .summary-points {
        border: 1px solid $border-color;
        margin-bottom: 1rem;
        padding: 1rem;
        width: 100%;
    }
    .overall {
        margin-bottom: 1rem;
    }
    .summary-categories {
        width: 100%;

        @media screen and (min-width: 1100px) {
            column-gap: 1rem;
            row-gap: 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
    .category {
        align-items: center;
        display: flex;
    }
    .points {
        font-size: 0.9rem;
        text-align: right;
        width: 3rem;
    }
</style>

<div class="summary">
    <div class="summary-points thing-container">
        <div class="overall">
            <ProgressBar
                title="Overall"
                have={$userAchievementStore.achievementCategories[0].have}
                total={$userAchievementStore.achievementCategories[0].total}
                --bar-height="2.5rem"
            />
        </div>

        <div class="summary-categories">
            {#each categories as category}
                {@const stats = $userAchievementStore.achievementCategories[category.id]}
                <div class="category">
                    <ProgressBar
                        title={category.name}
                        have={stats.have}
                        total={stats.total}
                    />
                    <div class="points {getPercentClass(stats.havePoints / stats.totalPoints * 100)}">
                        {#if stats.totalPoints > 0}
                            {stats.totalPoints - stats.havePoints}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="summary-recent">
        {#each $userAchievementStore.achievementRecent as recent}
            <AchievementsAchievement
                achievementId={recent}
                alwaysShow={true}
            />
        {/each}
    </div>
</div>
