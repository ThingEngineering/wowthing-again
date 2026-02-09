<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { Character } from '@/types';
    import type { GroupByContext } from '@/utils/get-character-group-func';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';

    type Props = { group: Character[]; groupByContext: GroupByContext };
    let { group, groupByContext }: Props = $props();

    let groupedByValues = $derived(groupByContext.groupByFn(group[0]).split('|'));
</script>

<style lang="scss">
    .tag {
        background: var(--color-highlight-background);
    }
    .groupings {
        // flex-grow: 1;
        gap: 0.6rem;
    }
    .realm-abbreviated {
        display: inline-block;
        width: 200px;
    }
</style>

<div class="flex-wrapper">
    <div class="flex-wrapper groupings">
        {#each groupByContext?.groupBy as groupBy, groupByIndex (groupBy)}
            {@const groupValue = groupedByValues[groupByIndex]}
            <span>
                {#if groupBy === 'account'}
                    <span class="tag">{groupValue || 'No-Tag'}</span>
                {:else if groupBy === 'faction'}
                    {@const reversed = groupByContext.sortBy.includes('-faction')}
                    {@const parsed = parseInt(groupValue, 10)}
                    {@const factionAsEnum = reversed ? Math.abs(parsed - 5) : parsed}
                    <FactionIcon faction={factionAsEnum} />
                {:else if groupBy === 'enabled'}
                    Account: {groupValue === 'a' ? 'Enabled' : 'Disabled'}
                {:else if groupBy === 'guild'}
                    {groupValue}
                {:else if groupBy === 'maxlevel'}
                    {groupValue === 'a' ? 'Max Level' : 'Low Level'}
                {:else if groupBy === 'pinned'}
                    {groupValue === 'a' ? 'Pinned' : 'Not pinned'}
                {:else if groupBy === 'realm'}
                    <span class="realm-abbreviated text-overflow" data-tooltip={groupValue}>
                        {groupValue}
                    </span>
                {:else if groupBy.startsWith('tag:')}
                    {@const tagId = parseInt(groupBy.split(':')[1])}
                    {@const tag = settingsState.value.tags.find((tag) => tag.id === tagId)}
                    <span
                        class:status-success={groupValue === '0'}
                        class:status-warn={groupValue === '1'}
                    >
                        {tag?.name}
                    </span>
                {:else}
                    {groupBy}: {groupValue}
                {/if}
            </span>
        {/each}
    </div>

    {#if group.length > 1}
        <span class="group-count">x{group.length}</span>
    {/if}
</div>
