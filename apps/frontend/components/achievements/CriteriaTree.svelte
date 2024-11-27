<script lang="ts">
    import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator'
    import { CriteriaType } from '@/enums/criteria-type'
    import { Faction } from '@/enums/faction';
    import { staticStore } from '@/shared/stores/static'
    import { achievementStore, userAchievementStore } from '@/stores'
    import type { AchievementDataAchievement, AchievementDataCriteria, AchievementDataCriteriaTree } from '@/types'

    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import { forceShowCriteriaTree } from '@/data/achievements';

    export let accountWide = false
    export let achievement: AchievementDataAchievement
    export let characterId = 0
    export let child = false
    export let criteriaCharacters: Record<number, [number, number][]>;
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

        if (achievement.isAccountWide) {
            const maxCharacter = criteriaCharacters?.[criteriaTree?.criteriaId || -1]?.[0]?.[1] || 0;
            have = maxCharacter > 0 && maxCharacter >= criteriaTree.amount;
        }
        else {
            let maybeCriteria: number[][] = [];
            maybeCriteria = criteriaCharacters[criteria?.id] || [[0, 0]];

            if (achievement.isAccountWide) {
                // maybeCriteria = criteriaCharacters[criteria?.id] || [[0, 0]];
            }
            else if (characterId > 0) {
                maybeCriteria = maybeCriteria.filter(([charId]) => charId === characterId)
            }

            if (maybeCriteria.length > 0) {
                have = (
                    (criteriaTree.amount > 0 && maybeCriteria[0][0] >= criteriaTree.amount) ||
                    (rootCriteriaTree?.operator === CriteriaTreeOperator.All && maybeCriteria[0][0] > 0)
                )
            }
            else {
                have = (
                    //(criteriaTree.amount > 0 &&)
                    haveMap?.[criteriaTreeId] > 0 &&
                    haveMap?.[criteriaTreeId] >= criteriaTree.amount
                    // (rootCriteriaTree?.operator === CriteriaTreeOperator.All && haveMap?.[criteriaTreeId] > 0)
                );
            }
        }

        if (rootCriteriaTree.id === 81150)
            console.log({rootCriteriaTree, criteria, criteriaTree, description, have, haveMap})

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
            else if (criteria?.type === CriteriaType.ReputationGained) {
                description = `Gain reputation #${criteria.asset}`
            }
            else {
                // console.log('Unknown criteria', criteriaTree, criteria)
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
        --image-margin-top: -4px;

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
        color: adjust-color($color-fail, $lightness: +15%);
    }
</style>

{#if criteriaTree &&
    (forceShowCriteriaTree.has(criteriaTree.id) || (criteriaTree.flags & 0x02) === 0) &&
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
                <YesNoIcon state={have} />

                {#if criteriaTree.isAllianceOnly}
                    <FactionIcon faction={Faction.Alliance} />
                {:else if criteriaTree.isHordeOnly}
                    <FactionIcon faction={Faction.Horde} />
                {/if}

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
                    {criteriaCharacters}
                    {haveMap}
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>
{/if}
