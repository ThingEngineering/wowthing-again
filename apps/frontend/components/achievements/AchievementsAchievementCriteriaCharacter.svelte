<script lang="ts">
    import { achievementStore, userAchievementStore, userQuestStore, userStore } from '@/stores'
    import type {AchievementDataAchievement, AchievementDataCriteriaTree} from '@/types'
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm'
    import { getCharacterData } from '@/utils/achievements'
    import type { AchievementDataCharacter } from '@/utils/achievements'

    import AchievementCriteriaBar from './AchievementsAchievementCriteriaBar.svelte'
    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let achievement: AchievementDataAchievement

    let criteriaTree: AchievementDataCriteriaTree
    let data: AchievementDataCharacter
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[achievement.criteriaTreeId]
        data = getCharacterData(
            $achievementStore.data,
            $userAchievementStore.data,
            $userStore.data,
            $userQuestStore.data,
            achievement
        )
    }
</script>

<style lang="scss">
    div {
        border-top: 1px dashed $border-color;
        margin-top: 0.5rem;
        padding-top: 0.25rem;
        width: 100%;
    }

    .criteria {
        display: grid;
        grid-area: criteria;
        grid-template-columns: 1fr 1fr;
    }

    .progress {
        grid-area: progress;

        & :global(.progress-container:nth-child(n+2)) {
            margin-top: 0.3rem;
        }
    }
</style>

{#if criteriaTree}
    <div class="criteria">
        {#if criteriaTree.children.length === 1}
            {#if achievement?.isProgressBar === true}
                <AchievementCriteriaBar {achievement} />
            {/if}
        {:else}
            {#each criteriaTree.children as child}
                <AchievementCriteriaTree
                    {achievement}
                    criteriaTreeId={child}
                />
            {/each}
        {/if}
    </div>

    {#if data.characters.length > 0}
        <div class="progress">
            {#each data.characters as [characterId, count]}
                <ProgressBar
                    title="{getCharacterNameRealm(characterId)}"
                    have={count}
                    total={data.total}
                />
            {/each}
        </div>
    {/if}
{/if}
