<script lang="ts">
    import { staticStore, userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import type {Character} from '@/types'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadInstance from './LockoutsTableHeadInstance.svelte'
    import RowLockout from './LockoutsTableRowLockout.svelte'

    const filterFunc = function(char: Character): boolean {
        return char.level > 10
    }

    const anyLockouts = function(char: Character): string {
        return Object.keys(char.lockouts || {}).length > 0 ? 'a' : 'z'
    }
    const sortFunc = getCharacterSortFunc($settingsData, anyLockouts)

    $: {
        console.log($userStore.data.allLockouts)
        console.log($staticStore.data.instances)
    }
</script>

<CharacterTable
    {filterFunc}
    {sortFunc}
>
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
