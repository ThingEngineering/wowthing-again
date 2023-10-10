<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { achievementStore, userAchievementStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator'
    import { CriteriaType } from '@/enums/criteria-type'
    import type { AchievementDataAchievement, AchievementDataCriteria, AchievementDataCriteriaTree } from '@/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'

    export let accountWide = false
    export let achievement: AchievementDataAchievement
    export let characterId = 0
    export let child = false
    export let criteriaTreeId: number
    export let haveMap: Record<number, number> = null
    export let rootCriteriaTree: AchievementDataCriteriaTree
    
    let criteria: AchievementDataCriteria
    let criteriaTree: AchievementDataCriteriaTree
    let description: string
    let have: boolean
    let linkId: number
    let linkParams: Record<string, string>
    let linkType: string
    $: {
        criteriaTree = $achievementStore.criteriaTree[criteriaTreeId]
        criteria = $achievementStore.criteria[criteriaTree?.criteriaId]
        description = criteriaTree.description

        if (characterId > 0) {
            const charCriteria = ($userAchievementStore.criteria[criteriaTreeId] || [])
                .filter((crit) => crit[0] === characterId)
            have = (
                charCriteria.length > 0 && (
                    (criteriaTree.amount > 0 && charCriteria[0][0] >= criteriaTree.amount) ||
                    (rootCriteriaTree?.operator === CriteriaTreeOperator.All && charCriteria[0][0] > 0)
                )
            )
        }
        else {
            have = (
                (criteriaTree.amount > 0 && haveMap?.[criteriaTreeId] >= criteriaTree.amount) ||
                (rootCriteriaTree?.operator === CriteriaTreeOperator.All && haveMap?.[criteriaTreeId] > 0)
            )
        }

        // Use Object Description
        if ((criteriaTree.flags & 0x20) > 0 || !description) {
            const criteria = $achievementStore.criteria[criteriaTree.criteriaId]
            if (criteria?.type === CriteriaType.EarnAchievement) {
                description = $achievementStore.achievement[criteria.asset]?.name ?? `Achievement #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.CastSpell) {
                description = `Cast spell #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.CompleteQuest) {
                //console.log('quest', criteriaTree, criteria)
            }
            else if (criteria?.type === CriteriaType.GarrisonMissionSucceeded) {
                description = `Garrison mission #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.HaveSpellCastOnYou) {
                description = `Have spell cast on you #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.KillNPC) {
                description = `NPC #${criteria.asset}`
            }
            else if (criteria?.type === CriteriaType.GainAura) {
                description = `Gain aura #${criteria.asset}`
            }
            else {
                //console.log('Unknown criteria', criteriaTree, criteria)
            }
        }

        // Link type
        linkId = 0
        linkParams = {}
        linkType = null
        if (criteria) {
            if (criteria.type === CriteriaType.CompleteQuest) {
                linkType = 'quest'
                linkId = criteria.asset
            }
            else if (criteria.type === CriteriaType.EarnAchievement) {
                linkType = 'achievement'
                linkId = criteria.asset
                
                const earned = $userAchievementStore.achievements[criteria.asset]
                if (earned) {
                    linkParams['who'] = 'You'
                    linkParams['when'] = earned.toString() + '000'
                }
            }
            else if (criteria.type === CriteriaType.KillNPC) {
                linkType = 'npc'
                linkId = criteria.asset
            }
            else if (
                criteria.type === CriteriaType.AccountKnowsPet ||
                criteria.type === CriteriaType.ObtainPetThroughBattle
            ) {
                const pet = $staticStore.petsByName[criteriaTree.description]
                if (pet) {
                    linkType = 'npc'
                    linkId = pet.creatureId
                }
            }
            
            if (criteriaTree.description === 'Engineers and Archaeologists') {
                console.log(criteriaTree, criteria)
            }
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
        padding-left: 1.5rem;
    }
    .status-fail {
        color: adjust-color($colour-fail, $lightness: +15%);
    }
</style>

{#if criteriaTree &&
    (criteriaTree.flags & 0x02) === 0 &&
    (description || criteriaTree.children.length > 0)
}
    <div
        class:drop-shadow={!child}
        class:status-success={have}
        class:status-fail={!have}
        class:child
        data-tree-id={criteriaTreeId}
    >
        {#if description}
            <WowheadLink
                extraParams={linkParams}
                id={linkId}
                type={linkType}
            >
                <IconifyIcon icon={have ? iconStrings.yes : iconStrings.no} />

                {description}
            </WowheadLink>
        {/if}

        {#if criteriaTree.children.length > 0}
            {#each criteriaTree.children as child}
                <svelte:self
                    child={true}
                    criteriaTreeId={child}
                    {accountWide}
                    {achievement}
                    {characterId}
                    {haveMap}
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>
{/if}
