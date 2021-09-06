<script lang="ts">
    import { userStore } from '@/stores'
    import type {Character} from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadInstance from './LockoutsTableHeadInstance.svelte'
    import RowLockout from './LockoutsTableRowLockout.svelte'

    const filterFunc = function(char: Character): boolean {
        return char.level > 10
    }
</script>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        {#each $userStore.data.allLockouts as instanceDifficulty}
            <HeadInstance {instanceDifficulty} />
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each $userStore.data.allLockouts as instanceDifficulty}
            <RowLockout {character} {instanceDifficulty} />
        {/each}
    </svelte:fragment>
</CharacterTable>
