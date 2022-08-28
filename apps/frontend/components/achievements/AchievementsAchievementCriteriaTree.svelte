<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { achievementStore, userAchievementStore } from '@/stores'
    import { CriteriaType } from '@/types/enums'
    import type { AchievementDataAchievement, AchievementDataCriteriaTree } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let accountWide = false
    export let achievement: AchievementDataAchievement
    export let characterId = 0
    export let child = false
    export let criteriaTreeId: number
    export let haveMap: Record<number, number> = null
    export let rootCriteriaTree: AchievementDataCriteriaTree
    
    let criteriaTree: AchievementDataCriteriaTree
    let description: string
    let have: boolean
    let showStatus: boolean
    $: {
        criteriaTree = $achievementStore.data.criteriaTree[criteriaTreeId]
        description = criteriaTree.description

        if (characterId > 0) {
            const charCriteria = ($userAchievementStore.data.criteria[criteriaTreeId] || [])
                .filter((crit) => crit[0] === characterId)
            have = (
                charCriteria.length > 0 && (
                    (criteriaTree.amount > 0 && charCriteria[0][0] >= criteriaTree.amount) ||
                    (rootCriteriaTree?.operator === 4 && charCriteria[0][0] > 0)
                )
            )
            //have = 
            if (achievement.id === 14779) {
                console.log(criteriaTree)
                console.log(characterId, charCriteria, have)
            }
        }
        else {
            have = (
                (criteriaTree.amount > 0 && haveMap?.[criteriaTreeId] >= criteriaTree.amount) ||
                (rootCriteriaTree?.operator === 4 && haveMap?.[criteriaTreeId] > 0)
            )
        }

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

        showStatus = accountWide || characterId > 0

        if (achievement?.id === 14744) {
            //console.log(characterId, have, criteriaTree)
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
        class="drop-shadow"
        class:status-success={showStatus && have}
        class:status-fail={showStatus && !have}
        class:child
    >
        {#if showStatus}
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
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>
{/if}
