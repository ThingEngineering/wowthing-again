<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';
    import type { GroupByContext } from '@/utils/get-character-group-func';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';

    export let groupByContext: GroupByContext;
    export let group: Character[];

    $: groupedByValues = groupByContext.groupByFn(group[0]).split('|');
</script>

<style lang="scss">
    .tag {
        background: $highlight-background;
        padding-left: $width-padding;
        padding-right: $width-padding;
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
        {#each groupByContext?.groupBy as groupBy, groupByIndex}
            {@const groupValue = groupedByValues[groupByIndex]}
            <span>
                {#if groupBy === 'account'}
                    <span class="tag">{groupValue || 'No-Tag'}</span>
                {:else if groupBy === 'faction'}
                    {@const factionAsEnum = parseInt(groupValue, 10)}
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
                    <span class="realm-abbreviated text-overflow" use:basicTooltip={groupValue}>
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
