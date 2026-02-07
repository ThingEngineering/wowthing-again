<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import getPercentClass from '@/utils/get-percent-class';
    import type { AchievementDataCategory } from '@/types';

    import AchievementsAchievement from './Achievement.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    let [categories, extraCategories] = $derived.by(() => {
        let retNormal: AchievementDataCategory[] = [];
        let retExtra: AchievementDataCategory[] = [];

        let nulls = 0;
        for (const category of wowthingData.achievements.categories) {
            if (category === null) {
                nulls++;
                continue;
            }
            if (nulls === 0) {
                retNormal.push(category);
            } else if (nulls === 1) {
                retExtra.push(category);
            }
        }

        return [retNormal, retExtra];
    });
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
        border: 1px solid var(--border-color);
        margin-bottom: 1rem;
        padding: 1rem;
        width: 100%;
    }
    .summary-categories {
        border-top: 1px solid var(--border-color);
        margin-top: 1rem;
        padding-top: 1rem;
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
                have={userState.achievements.categories[0].have}
                total={userState.achievements.categories[0].total}
                --bar-height="2.5rem"
            />
        </div>

        <div class="summary-categories">
            {#each categories as category (category.id)}
                {@const stats = userState.achievements.categories[category.id]}
                <div class="category">
                    <ProgressBar title={category.name} have={stats.have} total={stats.total} />
                    <div
                        class="points {getPercentClass(
                            (stats.havePoints / stats.totalPoints) * 100
                        )}"
                    >
                        {#if stats.totalPoints > 0}
                            {stats.totalPoints - stats.havePoints}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>

        <div class="summary-categories">
            {#each extraCategories as category (category.id)}
                {@const stats = userState.achievements.categories[category.id]}
                <div class="category">
                    <ProgressBar title={category.name} have={stats.have} total={stats.total} />
                    <div
                        class="points {getPercentClass(
                            (stats.havePoints / stats.totalPoints) * 100
                        )}"
                    >
                        {#if stats.totalPoints > 0}
                            {stats.totalPoints - stats.havePoints}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="summary-recent">
        {#each userState.achievements.recent as recent (recent)}
            <AchievementsAchievement achievementId={recent} alwaysShow={true} />
        {/each}
    </div>
</div>
