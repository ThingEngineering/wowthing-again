<script lang="ts">
    import find from 'lodash/find'
    import max from 'lodash/max'

    import { reputationState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import toDigits from '@/utils/to-digits'
    import type { Character, StaticDataReputationCategory } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'

    export let slug: string

    let category: StaticDataReputationCategory
    let sortFunc: (char: Character) => string
    $: {
        category = find($staticStore.data.reputationSets, (r) => r?.slug === slug)

        const order: number[] = $reputationState.sortOrder[slug]
        if (order?.length > 0) {
            sortFunc = (char) => {
                let repValue = -1
                let paragonValue = -1
                for (const repId of order) {
                    repValue = Math.max(repValue, char.reputations?.[repId] || -1)
                    const paragon = char.paragons?.[repId]
                    if (paragon) {
                        if (paragon.rewardAvailable) {
                            paragonValue = 99999
                        }
                        else {
                            paragonValue = paragon.current
                        }
                    }
                }

                return `${toDigits(100000 - repValue, 6)}-${toDigits(10000 - paragonValue, 6)}`
            }
        }
        else {
            sortFunc = getCharacterSortFunc($settingsData)
        }
    }
</script>

<CharacterTable {sortFunc}>
    <CharacterTableHead slot="head">
        {#key category.name}
            {#each category.reputations as reputationSet}
                {#each reputationSet as reputation}
                    <TableHead
                        {reputation}
                        {slug}
                    />
                {/each}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key category.name}
            {#each category.reputations as reputationSet, reputationSetIndex}
                {#each reputationSet as reputation, reputationIndex}
                    <TableRow
                        alt={reputationSetIndex % 2 === 1}
                        characterRep={character.reputationData[slug].sets[reputationSetIndex][reputationIndex]}
                        {character}
                        {reputation}
                    />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
