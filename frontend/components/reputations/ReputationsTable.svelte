<script lang="ts">
    import find from 'lodash/find'

    import { reputationState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import toDigits from '@/utils/to-digits'
    import type { Character } from '@/types'
    import type { StaticDataReputationCategory } from '@/types/data/static'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Error from '@/components/common/Error.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'

    export let slug: string

    let category: StaticDataReputationCategory
    let sorted: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => string
    $: {
        category = find($staticStore.data.reputationSets, (r) => r?.slug === slug)
        if (!category) {
            break $
        }

        filterFunc = (char: Character) => char.level >= (category.minimumLevel ?? 0)

        const order: number[] = $reputationState.sortOrder[slug]
        if (order?.length > 0) {
            sorted = true
            sortFunc = (char) => {
                let repValue = -1
                let paragonValue = -1
                for (const repId of order) {
                    repValue = Math.max(repValue, char.reputations?.[repId] ?? -1)
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
            sorted = false
            sortFunc = getCharacterSortFunc($settingsData)
        }
    }
</script>

{#if category}
    <CharacterTable
        skipGrouping={sorted}
        {filterFunc}
        {sortFunc}
    >
        <CharacterTableHead slot="head">
            {#each category.reputations as reputationSet}
                <td class="spacer"></td>
                
                {#each reputationSet as reputation}
                    <TableHead
                        {reputation}
                        {slug}
                    />
                {/each}
            {/each}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each category.reputations as reputationSet, reputationSetIndex}
                <td class="spacer"></td>

                {#each reputationSet as reputation, reputationIndex}
                    <TableRow
                        characterRep={character.reputationData[slug].sets[reputationSetIndex][reputationIndex]}
                        {character}
                        {reputation}
                    />
                {/each}
            {/each}
        </svelte:fragment>
    </CharacterTable>
{:else}
    <Error
        text="No reputations found matching provided path"
    />
{/if}
