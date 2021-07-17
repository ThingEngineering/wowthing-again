<script lang="ts">
    import userStore from '@/stores/user'
    import type {Character} from '@/types'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import GroupHead from './TableGroupHead.svelte'
    import RowLockout from './TableRowLockout.svelte'

    const filterFunc: (char: Character) => boolean = (char) => char.level > 10
</script>

<CharacterTable {filterFunc} endSpacer={false}>
    <GroupHead slot="groupHead" let:groupIndex {groupIndex} />

    <svelte:fragment slot="rowExtra" let:character>
        {#each $userStore.data.allLockouts as instanceDifficulty}
            <RowLockout {character} {instanceDifficulty} />
        {/each}
    </svelte:fragment>
</CharacterTable>
