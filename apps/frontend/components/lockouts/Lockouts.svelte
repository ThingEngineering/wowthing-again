<script lang="ts">
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'

    import { lockoutDifficultyOrder } from '@/data/difficulty'
    import { staticStore, userStore } from '@/stores'
    import { lockoutState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import leftPad from '@/utils/left-pad'
    import type { Character, InstanceDifficulty } from '@/types'
    import type { StaticDataInstance } from '@/types/data/static'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadInstance from './LockoutsTableHeadInstance.svelte'
    import RowLockout from './LockoutsTableRowLockout.svelte'

    const filterFunc = function(char: Character): boolean {
        return char.level > 10
    }

    const anyLockouts = function(char: Character): string {
        return Object.keys(char.lockouts || {}).length > 0 ? 'b' : 'z'
    }
    const hasSortedLockout = function(char: Character): string {
        return some(
            Object.keys(char.lockouts || {}),
            (key) => key.startsWith(`${$lockoutState.sortBy}-`)
        ) ? 'a' : anyLockouts(char)
    }

    let sorted: boolean
    let sortedLockouts: InstanceDifficulty[]
    let sortFunc: (char: Character) => string

    $: {
        sorted = $lockoutState.sortBy > 0
        sortFunc = getCharacterSortFunc($settingsData, $staticStore.data, sorted ? hasSortedLockout : anyLockouts)
    }

    $: {
        sortedLockouts = sortBy(
            $userStore.data.allLockouts,
            (diff: InstanceDifficulty) => {
                const instance: StaticDataInstance = $staticStore.data.instances[diff.instanceId]
                if (!diff.difficulty || !instance) {
                    return 'z'
                }

                const orderIndex = lockoutDifficultyOrder.indexOf(diff.difficulty.id)
                return [
                    leftPad(100 - instance.expansion, 2, '0'),
                    leftPad(orderIndex >= 0 ? orderIndex : 99, 2, '0'),
                    instance.shortName,
                    diff.difficulty.shortName,
                ].join('|')
            }
        )
    }
</script>

<CharacterTable
    skipGrouping={true}
    {filterFunc}
    {sortFunc}
>
    <CharacterTableHead slot="head">
        {#each sortedLockouts as instanceDifficulty}
            <HeadInstance {instanceDifficulty} />
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#each sortedLockouts as instanceDifficulty}
            <RowLockout {character} {instanceDifficulty} />
        {/each}
    </svelte:fragment>
</CharacterTable>
