<script lang="ts">
    import mdiCheck from '@iconify/icons-mdi/check'
    import mdiClose from '@iconify/icons-mdi/close'

    import { achievementStore } from '@/stores'
    import type { AchievementDataCriteriaTree } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let accountWide = false
    //export let achievement: AchievementDataAchievement
    export let criteriaTreeId: number
    export let haveMap: Record<number, number> = null

    let criteriaTree: AchievementDataCriteriaTree
    let have: boolean
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[criteriaTreeId]
        have = haveMap?.[criteriaTreeId] >= criteriaTree.amount
    }
</script>

<style lang="scss">
    div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        & :global(svg) {
            margin-top: -4px;
        }
    }
</style>

{#if criteriaTree}
    <div
        class:status-success={accountWide && have}
        class:status-fail={accountWide && !have}
    >
        {#if accountWide}
            <IconifyIcon icon={have ? mdiCheck : mdiClose} />
        {/if}
        {criteriaTree.description}
        {#if criteriaTree.children.length > 0}
            {#each criteriaTree.children as child}
                <svelte:self
                    criteriaTreeId={child}
                    {accountWide}
                    {haveMap}
                />
            {/each}
        {/if}
    </div>
{/if}
