<script lang="ts">
    import { achievementStore } from '@/stores';
    import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator';
    import { CriteriaType } from '@/enums/criteria-type';
    import { leftPad } from '@/utils/formatting';
    import type {
        AchievementDataAchievement,
        AchievementDataCriteria,
        AchievementDataCriteriaTree,
    } from '@/types';

    export let achievement: AchievementDataAchievement;
    export let criteriaTreeId: number;
    export let depth = 0;

    let criteria: AchievementDataCriteria;
    let criteriaTree: AchievementDataCriteriaTree;
    $: {
        criteriaTree = $achievementStore.criteriaTree[criteriaTreeId];
        criteria = $achievementStore.criteria[criteriaTree?.criteriaId];
    }
</script>

<style lang="scss">
    .criteria-tree {
        align-items: center;
        display: flex;
        padding-bottom: 0.3rem;
        padding-left: calc(1.5rem * var(--depth, 0));
        padding-top: 0.3rem;

        &:not(:last-child) {
            border-bottom: 1px dashed var(--border-color);
        }
    }
    .info {
        display: flex;
        width: calc(25rem + (-1.5rem * var(--depth, 0)));

        code {
            white-space: nowrap;
        }
        span {
            padding-right: 1rem;
        }
    }
    .data {
        span + span {
            border-left: 1px solid var(--border-color);
            padding-left: 0.5rem;
        }
    }
</style>

{#if criteriaTree}
    <div class="criteria-tree" style:--depth={depth}>
        <div class="info">
            <code>[{criteriaTreeId}]</code>
            <span class="text-overflow" data-tooltip={criteriaTree.description}
                >{criteriaTree.description || 'BLANK'}</span
            >
        </div>

        <div class="data">
            <div>
                <span>
                    amount:
                    <code>{@html leftPad(criteriaTree.amount, 4)}</code>
                </span>
                <span>
                    operator:
                    <code>{criteriaTree.operator}</code>
                    {CriteriaTreeOperator[criteriaTree.operator]}
                </span>
                {#if criteriaTree.flags}
                    <span>
                        flags:
                        <code>{@html leftPad(criteriaTree.flags, 6)}</code>
                    </span>
                {/if}
            </div>

            <div>
                {#if criteria}
                    <code>[{criteria.id}]</code>
                    <span>
                        asset:
                        <code>{@html leftPad(criteria.asset, 6)}</code>
                    </span>
                    {#if criteria.modifierTreeId}
                        <span>
                            modifierTree:
                            <code>{@html leftPad(criteria.modifierTreeId, 6)}</code>
                        </span>
                    {/if}
                    <span>
                        type:
                        <code>{@html leftPad(criteria.type, 3)}</code>
                        {CriteriaType[criteria.type] || 'UNKNOWN'}
                    </span>
                {/if}
            </div>
        </div>
    </div>

    {#each criteriaTree?.children || [] as childId}
        <svelte:self {achievement} criteriaTreeId={childId} depth={depth + 1} />
    {/each}
{:else}
    <div class="criteria-tree" style:--depth={depth}>
        Unknown criteria tree ID: <code>{criteriaTreeId}</code>
    </div>
{/if}
