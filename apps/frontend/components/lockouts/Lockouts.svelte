<script lang="ts">
    import { userStore } from '@/stores';
    import { lockoutState } from '@/stores/local-storage';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { Character } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import HeadInstance from './LockoutsTableHeadInstance.svelte';
    import RowLockout from './LockoutsTableRowLockout.svelte';

    const filterFunc = function (char: Character): boolean {
        return char.level > 10;
    };

    const anyLockouts = function (char: Character): string {
        return Object.keys(char.lockouts || {}).length > 0 ? 'b' : 'z';
    };
    const hasSortedLockout = function (char: Character): string {
        return Object.keys(char.lockouts || {}).some((key) =>
            key.startsWith(`${$lockoutState.sortBy}-`),
        )
            ? 'a'
            : anyLockouts(char);
    };

    let sorted: boolean;
    let sortFunc: (char: Character) => string;

    $: {
        sorted = $lockoutState.sortBy > 0;
        sortFunc = $getCharacterSortFunc(sorted ? hasSortedLockout : anyLockouts);
    }
</script>

<CharacterTable skipGrouping={true} skipIgnored={true} {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        {#each $userStore.allLockouts as instanceDifficulty}
            <HeadInstance {instanceDifficulty} />
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each $userStore.allLockouts as instanceDifficulty}
            <RowLockout {character} {instanceDifficulty} />
        {/each}
    </svelte:fragment>
</CharacterTable>
