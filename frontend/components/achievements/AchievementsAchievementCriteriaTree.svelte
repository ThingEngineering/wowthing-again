<script lang="ts">
    import { achievementStore } from '@/stores'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    export let achievement: AchievementDataAchievement
    export let criteriaTreeId: number

    let criteriaTree: AchievementDataCriteriaTree
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[criteriaTreeId]
    }
</script>

{#if criteriaTree}
    <div>
        {criteriaTree.description}
        {#if criteriaTree.children.length > 0}
            {#each criteriaTree.children as child}
                <svelte:self criteriaTreeId={child} />
            {/each}
        {/if}
    </div>
{/if}
