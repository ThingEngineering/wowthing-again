<script lang="ts">
    import { achievementStore, userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { getCharacterData } from '@/utils/achievements'
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'
    import type { AchievementDataCharacter } from '@/utils/achievements'

    import AchievementCriteriaBar from './AchievementsAchievementCriteriaBar.svelte'
    import AchievementCriteriaTree from './AchievementsAchievementCriteriaTree.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let achievement: AchievementDataAchievement

    let data: AchievementDataCharacter
    let rootCriteriaTree: AchievementDataCriteriaTree
    let selectedCharacterId: number
    $: {
        rootCriteriaTree = $achievementStore.criteriaTree[achievement.criteriaTreeId]
        data = getCharacterData(
            $achievementStore,
            $userAchievementStore,
            $userStore,
            $userQuestStore,
            achievement
        )

        if (!selectedCharacterId) {
            selectedCharacterId = data.characters?.[0]?.[0] || 0
        }

        if (achievement.id === 14744) {
            //console.log({achievement, criteriaTree: rootCriteriaTree, data})
        }
    }
</script>

<style lang="scss">
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

{#if rootCriteriaTree}
    <div class="criteria">
        {#if achievement.isAccountWide && rootCriteriaTree.children.length === 1 && achievement?.isProgressBar === true}
            <AchievementCriteriaBar />
        {:else}
            {#each rootCriteriaTree.children as child}
                <AchievementCriteriaTree
                    characterId={selectedCharacterId}
                    criteriaTreeId={child}
                    {achievement}
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>

    {#if data.characters.length > 0}
        <div class="progress">
            {#each data.characters as [characterId, count]}
                {@const selected = selectedCharacterId === characterId}
                <ProgressBar
                    on:click={() => selectedCharacterId = characterId}
                    title="{getCharacterNameRealm(characterId)}"
                    have={count}
                    textCls={selected ? 'status-success' : null}
                    total={data.total}
                    {selected}
                />
            {/each}
        </div>
    {/if}
{/if}
