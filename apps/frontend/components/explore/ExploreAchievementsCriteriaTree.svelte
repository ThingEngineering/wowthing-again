<script lang="ts">
    import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator';
    import { CriteriaType } from '@/enums/criteria-type';
    import { wowthingData } from '@/shared/stores/data/store.svelte';
    import { leftPad } from '@/utils/formatting';
    import type { AchievementDataAchievement } from '@/types';

    import Self from './ExploreAchievementsCriteriaTree.svelte';

    type Props = {
        achievement: AchievementDataAchievement;
        criteriaTreeId: number;
        depth?: number;
    };
    let { achievement, criteriaTreeId, depth = 0 }: Props = $props();

    let criteriaTree = $derived(wowthingData.achievements.criteriaTreeById.get(criteriaTreeId));
    let criteria = $derived(wowthingData.achievements.criteriaById.get(criteriaTree?.criteriaId));
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

    {#each criteriaTree?.children || [] as childId (childId)}
        <Self {achievement} criteriaTreeId={childId} depth={depth + 1} />
    {/each}
{:else}
    <div class="criteria-tree" style:--depth={depth}>
        Unknown criteria tree ID: <code>{criteriaTreeId}</code>
    </div>
{/if}
