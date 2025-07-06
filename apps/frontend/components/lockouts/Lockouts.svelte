<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userState } from '@/user-home/state/user';
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
        return char.lockoutKeys.length > 0 ? 'b' : 'z';
    };
    const hasSortedLockout = function (char: Character): string {
        return char.lockoutKeys.some((key) =>
            key.startsWith(`${browserState.current.lockouts.sortBy}-`)
        )
            ? 'a'
            : anyLockouts(char);
    };

    let sortFunc = $derived.by(() =>
        $getCharacterSortFunc(
            browserState.current.lockouts.sortBy > 0 ? hasSortedLockout : anyLockouts
        )
    );
    let allLockouts = $state.snapshot(userState.general.allLockouts);
</script>

<CharacterTable skipGrouping={true} skipIgnored={true} {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        {#each allLockouts as instanceDifficulty (instanceDifficulty)}
            <HeadInstance {instanceDifficulty} />
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each allLockouts as instanceDifficulty (instanceDifficulty)}
            <RowLockout {character} {instanceDifficulty} />
        {/each}
    </svelte:fragment>
</CharacterTable>
