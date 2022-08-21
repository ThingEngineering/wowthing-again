<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { achievementStore } from '@/stores'
    import { CriteriaType } from '@/types/enums'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let accountWide = false
    export let achievement: AchievementDataAchievement
    export let child = false
    export let criteriaTreeId: number
    export let haveMap: Record<number, number> = null

    let criteriaTree: AchievementDataCriteriaTree
    let description: string
    let have: boolean
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[criteriaTreeId]
        description = criteriaTree.description
        have = criteriaTree.amount > 0 && haveMap?.[criteriaTreeId] >= criteriaTree.amount

        // Use Object Description
        if ((criteriaTree.flags & 0x20) > 0 || !description) {
            const criteria = $achievementStore.data.criteria[criteriaTree.criteriaId]
            if (criteria?.type === CriteriaType.EarnAchievement) {
                description = $achievementStore.data.achievement[criteria.asset]?.name ?? `Achievement #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.CastSpell) {
                description = `Cast spell #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.GarrisonMissionSucceeded) {
                description = `Garrison mission #${criteria.asset}`
            }
            //console.log(criteria)
        }

        if (achievement?.id === 13691) {
            console.log(have, criteriaTree)
        }
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
    .child {
        padding-left: 1rem;
    }
</style>

{#if criteriaTree && (criteriaTree.flags & 0x02) === 0}
    <div
        class:status-success={accountWide && have}
        class:status-fail={accountWide && !have}
        class:child
    >
        {#if accountWide}
            <IconifyIcon icon={have ? iconStrings.yes : iconStrings.no} />
        {/if}

        {description}

        {#if criteriaTree.children.length > 0}
            {#each criteriaTree.children as child}
                <svelte:self
                    child={true}
                    criteriaTreeId={child}
                    {accountWide}
                    {achievement}
                    {haveMap}
                />
            {/each}
        {/if}
    </div>
{/if}
