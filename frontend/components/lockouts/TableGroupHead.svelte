<script lang="ts">
    import { data as userData } from '@/stores/user'
    import getCharacterTableSpan from '@/utils/get-character-table-span'

    import GroupHeadInstance from './TableGroupHeadInstance.svelte'
    import SpacerRow from '@/components/character-table/SpacerRow.svelte'

    export let groupIndex: number

    const span = getCharacterTableSpan()
</script>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr class="table-group-head">
    <td colspan="{span}">&nbsp;</td>

    {#each $userData.allLockouts as instanceDifficulty}
        <GroupHeadInstance {instanceDifficulty} />
    {/each}
</tr>
