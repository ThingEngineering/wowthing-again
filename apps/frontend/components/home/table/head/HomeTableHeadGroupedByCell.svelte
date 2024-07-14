<script lang="ts">
    import FactionIcon from "@/shared/components/images/FactionIcon.svelte";

    import {basicTooltip} from '@/shared/utils/tooltips'
    import type {GroupByContext} from "@/utils/get-character-group-func";
    import {Character} from "@/types";

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

    .realm-abbreviated {
        display: inline-block;

        width: 200px;
        text-overflow: ellipsis;
        overflow: clip;
        white-space: nowrap;
    }
</style>

{#each groupByContext?.groupBy as groupBy, groupByIndex}
    {@const groupValue = groupedByValues[groupByIndex]}

    {#if groupBy === 'account'}
        <span class="tag">{groupValue || 'No-Tag'}</span>
    {:else if groupBy === 'faction'}
        {@const factionAsEnum = parseInt(groupValue, 10)}
        <FactionIcon faction={factionAsEnum}/>
    {:else if groupBy === 'enabled'}
        Account: {groupValue === 'a' ? 'Enabled' : 'Disabled'}
    {:else if groupBy === 'maxlevel'}
        {groupValue === 'a' ? 'MAX Level' : 'Below MAX Level'}
    {:else if groupBy === 'pinned'}
        {groupValue === 'a' ? 'Pinned' : 'Not pinned'}
    {:else if groupBy === 'realm'}
        <span class="realm-abbreviated" use:basicTooltip={groupValue}>
            {groupValue}
        </span>
    {:else}
        {groupBy}: {groupValue}
    {/if}
    &nbsp;
{/each}

{#if group.length > 1}
    <span class="group-count">| x{group.length}</span>
{/if}
