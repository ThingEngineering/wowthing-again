<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userState } from '@/user-home/state/user';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { Character } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import HeadInstance from './LockoutsTableHeadInstance.svelte';
    import RowLockout from './LockoutsTableRowLockout.svelte';
    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import GroupedHead from './GroupedHead.svelte';

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
    let groupedLockouts = $derived.by(() => {
        const ret: [string, number][] = [];

        let count: number = 0;
        let lastId: number = 0;
        for (const { instanceId } of allLockouts) {
            if (instanceId !== lastId) {
                if (count > 0) {
                    ret.push([wowthingData.static.instanceById.get(lastId)?.shortName, count]);
                }
                lastId = instanceId;
                count = 1;
            } else {
                count++;
            }
        }

        if (count > 0) {
            ret.push([wowthingData.static.instanceById.get(lastId)?.shortName, count]);
        }

        return ret;
    });
    let groupedStripes = $derived.by(() => {
        const ret: boolean[] = [];

        let value = true;
        for (const [, colspan] of groupedLockouts) {
            for (let i = 0; i < colspan; i++) {
                ret.push(value);
            }
            value = !value;
        }

        return ret;
    });
</script>

<CharacterTable skipGrouping={true} skipIgnored={true} {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        <svelte:fragment slot="headText">
            <CheckboxInput
                name="lockouts_grouped"
                bind:value={browserState.current.lockouts.grouped}>Grouped</CheckboxInput
            >
        </svelte:fragment>

        <svelte:fragment slot="headTop" let:colspan>
            {#if browserState.current.lockouts.grouped}
                <GroupedHead {colspan} {groupedLockouts} />
            {/if}
        </svelte:fragment>

        {#each allLockouts as instanceDifficulty, index (instanceDifficulty)}
            <HeadInstance
                {instanceDifficulty}
                striped={browserState.current.lockouts.grouped && groupedStripes[index]}
            />
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each allLockouts as instanceDifficulty, index (instanceDifficulty)}
            <RowLockout
                {character}
                {instanceDifficulty}
                showNumbers={!browserState.current.lockouts.grouped}
                striped={groupedStripes[index]}
            />
        {/each}
    </svelte:fragment>
</CharacterTable>
