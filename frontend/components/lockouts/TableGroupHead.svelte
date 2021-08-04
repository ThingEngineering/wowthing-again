<script lang="ts">
    import { userStore } from '@/stores'
    import getCharacterTableSpan from '@/utils/get-character-table-span'

    import GroupHeadInstance from './TableGroupHeadInstance.svelte'
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte'

    export let groupIndex: number

    const span = getCharacterTableSpan()
</script>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr class="table-group-head">
    <td colspan="{span}">&nbsp;</td>

    {#each $userStore.data.allLockouts as instanceDifficulty}
        <GroupHeadInstance {instanceDifficulty} />
    {/each}
</tr>
