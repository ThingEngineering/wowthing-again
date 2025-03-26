<script lang="ts">
    import { forceShowCriteriaTree } from '@/data/achievements';
    import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator';
    import { CriteriaType } from '@/enums/criteria-type';
    import { staticStore } from '@/shared/stores/static';
    import { achievementStore, userAchievementStore } from '@/stores';
    import type {
        AchievementDataAchievement,
        AchievementDataCriteria,
        AchievementDataCriteriaTree,
    } from '@/types';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    export let accountWide = false;
    export let achievement: AchievementDataAchievement;
    export let characterId = 0;
    export let child = false;
    export let criteriaCharacters: Record<number, [number, number][]>;
    export let criteriaTreeId: number;
    export let haveMap: Record<number, number> = null;
    export let isReputation: boolean;
    export let rootCriteriaTree: AchievementDataCriteriaTree;

    let criteria: AchievementDataCriteria;
    let criteriaTree: AchievementDataCriteriaTree;
    let description: string;
    let have: boolean;
    let linkId: number;
    let linkParams: Record<string, string>;
    let linkType: string;
    $: {
        criteriaTree = $achievementStore.criteriaTree[criteriaTreeId];
        criteria = $achievementStore.criteria[criteriaTree?.criteriaId];
        description = criteriaTree.description;

        if (achievement.isAccountWide) {
            const maxCharacter =
                criteriaCharacters?.[criteriaTree?.criteriaId || -1]?.[0]?.[1] || 0;
            have = maxCharacter > 0 && maxCharacter >= criteriaTree.amount;
        } else {
            let maybeCriteria: number[][] = [];
            maybeCriteria = criteriaCharacters[criteria?.id] || [[0, 0]];

            if (achievement.isAccountWide) {
                // maybeCriteria = criteriaCharacters[criteria?.id] || [[0, 0]];
            } else if (characterId > 0) {
                maybeCriteria = maybeCriteria.filter(([charId]) => charId === characterId);
            }

            if (maybeCriteria.length > 0) {
                have =
                    (criteriaTree.amount > 0 && maybeCriteria[0][0] >= criteriaTree.amount) ||
                    (rootCriteriaTree?.operator === CriteriaTreeOperator.All &&
                        maybeCriteria[0][0] > 0);
            } else {
                have =
                    //(criteriaTree.amount > 0 &&)
                    haveMap?.[criteriaTreeId] > 0 &&
                    haveMap?.[criteriaTreeId] >= criteriaTree.amount;
                // (rootCriteriaTree?.operator === CriteriaTreeOperator.All && haveMap?.[criteriaTreeId] > 0)
            }
        }

        if (rootCriteriaTree.id === 81150)
            console.log({ rootCriteriaTree, criteria, criteriaTree, description, have, haveMap });

        // Use Object Description
        if ((criteriaTree.flags & 0x20) > 0 || !description) {
            const criteria = $achievementStore.criteria[criteriaTree.criteriaId];
            if (criteria?.type === CriteriaType.EarnAchievement) {
                description =
                    $achievementStore.achievement[criteria.asset]?.name ??
                    `Achievement #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.CastSpell) {
                description = `Cast spell #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.CompleteQuest) {
                //console.log('quest', criteriaTree, criteria)
            } else if (criteria?.type === CriteriaType.GarrisonMissionSucceeded) {
                description = `Garrison mission #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.HaveSpellCastOnYou) {
                description = `Have spell cast on you #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.KillNPC) {
                description = `NPC #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.GainAura) {
                description = `Gain aura #${criteria.asset}`;
            } else if (criteria?.type === CriteriaType.ReputationGained) {
                const faction = $staticStore.reputations[criteria.asset];
                description = `Gain reputation with ${faction?.name || `Faction #${criteria.asset}`}`;
            } else {
                // console.log('Unknown criteria', criteriaTree, criteria)
            }
        }

        // Link type
        linkId = 0;
        linkParams = {};
        linkType = null;
        if (criteria) {
            if (criteria.type === CriteriaType.CompleteQuest) {
                linkType = 'quest';
                linkId = criteria.asset;
            } else if (criteria.type === CriteriaType.EarnAchievement) {
                linkType = 'achievement';
                linkId = criteria.asset;

                const earned = $userAchievementStore.achievements[criteria.asset];
                if (earned) {
                    linkParams['who'] = 'You';
                    linkParams['when'] = earned.toString() + '000';
                }
            } else if (criteria.type === CriteriaType.KillNPC) {
                linkType = 'npc';
                linkId = criteria.asset;
            } else if (
                criteria.type === CriteriaType.AccountKnowsPet ||
                criteria.type === CriteriaType.ObtainPetThroughBattle
            ) {
                const pet = $staticStore.petsByName[criteriaTree.description];
                if (pet) {
                    linkType = 'npc';
                    linkId = pet.creatureId;
                }
            }

            if (criteriaTree.description === 'Engineers and Archaeologists') {
                console.log(criteriaTree, criteria);
            }
        }

        // Faction
        if (criteriaTree.isAllianceOnly) {
            description = `:alliance: ${description}`;
        } else if (criteriaTree.isHordeOnly) {
            description = `:horde: ${description}`;
        }
    }
</script>

<style lang="scss">
    div {
        --bar-height: 1.5rem;
        --image-margin-top: -4px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;

        :global(a) {
            width: 100%;
        }
        :global(svg) {
            margin-top: -4px;
        }
        :global(.progress-container) {
            cursor: pointer;
            margin: 0.25rem 0.25rem 0.25rem 0.25rem;
            width: calc(100% - 0.5rem);
        }
    }
    .child {
        padding-left: 1.5rem;
    }
    .status-fail {
        color: adjust-color($color-fail, $lightness: +15%);
    }
</style>

{#if criteriaTree && (forceShowCriteriaTree.has(criteriaTree.id) || (criteriaTree.flags & 0x02) === 0) && (description || criteriaTree.children.length > 0)}
    {@const showProgressBar =
        description &&
        criteriaTree.amount > 1 &&
        !have &&
        achievement.isAccountWide &&
        !isReputation}
    <div
        class:drop-shadow={!child}
        class:status-success={!showProgressBar && have}
        class:status-fail={!showProgressBar && !have}
        class:child
        data-tree-id={criteriaTreeId}
        data-criteria-id={criteriaTree?.criteriaId}
    >
        {#if description}
            <WowheadLink extraParams={linkParams} id={linkId} type={linkType}>
                {#if showProgressBar}
                    <ProgressBar
                        title={description}
                        have={criteriaCharacters[criteriaTree.criteriaId]?.[0]?.[1] || 0}
                        total={criteriaTree.amount}
                    />
                {:else}
                    <span>
                        <YesNoIcon state={have} />
                        <ParsedText text={description} />
                    </span>
                {/if}
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
                    {isReputation}
                    {rootCriteriaTree}
                />
            {/each}
        {/if}
    </div>
{/if}
