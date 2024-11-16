<script lang="ts">
    import { honorAchievements } from '@/data/achievements'
    import { achievementStore, userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { achievementState } from '@/stores/local-storage';
    import { AchievementDataAccount, getAccountData } from '@/utils/achievements'
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm';
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    import AchievementCriteriaTree from './CriteriaTree.svelte'
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

        if (achievement.id === 13558) {
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
    .criteria {
        border-top: 1px dashed $border-color;
        display: grid;
        grid-area: criteria;
        grid-template-columns: 1fr 1fr;
        margin-top: 0.5rem;
        padding-top: 0.25rem;
        width: 100%;

        &:empty {
            display: none;
        }
    }
    .progress {
        grid-area: progress;
        margin-top: 0.75rem;

        & :global(.progress-container:nth-child(n+2)) {
            margin-top: 0.3rem;
        }
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

            {#if data.characters.length > 0}
                {@const characters = data.characters.slice(0, $achievementState.showAllCharacters ? 9999 : 3)}
                <div class="progress">
                    {#each characters as [characterId, count]}
                        <ProgressBar
                            title="{getCharacterNameRealm(characterId)}"
                            have={count}
                            total={data.total}
                        />
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
{/if}
