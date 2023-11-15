<script lang="ts">
    import find from 'lodash/find'

    import { reputationState } from '@/stores/local-storage'
    import { staticStore } from '@/shared/stores/static'
    import { settingsStore } from '@/shared/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import { leftPad } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { StaticDataReputationCategory, StaticDataReputationSet } from '@/shared/stores/static/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Error from '@/components/common/Error.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'
    import TableRowRenown from './ReputationsTableRowRenown.svelte'

    export let slug: string

    let category: StaticDataReputationCategory
    let sorted: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => string
    $: {
        category = find($staticStore.reputationSets, (r) => r?.slug === slug)
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

                return [
                    leftPad(100000 - repValue, 6, '0'),
                    leftPad(10000 - paragonValue, 6, '0'),
                ].join('|')
            }
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        }
    }


    function isRenown(reputationSet: StaticDataReputationSet) {
        return reputationSet.both
            ? $staticStore.reputations[reputationSet.both.id].renownCurrencyId > 0
            : $staticStore.reputations[reputationSet.alliance?.id || reputationSet.horde.id].renownCurrencyId > 0
    }
</script>

{#if category?.reputations}
    <CharacterTable
        skipGrouping={sorted}
        skipIgnored={true}
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
            {#key `reputations|${slug}`}
                {#each category.reputations as reputationSets, reputationsIndex}
                    <td class="spacer"></td>

                    {#each reputationSets as reputationSet, reputationSetsIndex}
                        {#if isRenown(reputationSet)}
                            <TableRowRenown
                                characterRep={character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex]}
                                {character}
                                reputation={reputationSet}
                            />
                        {:else}
                            <TableRow
                                characterRep={character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex]}
                                {character}
                                reputation={reputationSet}
                            />
                        {/if}
                    {/each}
                {/each}
            {/key}
        </svelte:fragment>
    </CharacterTable>
{:else}
    <Error
        text="No reputations found matching provided path"
    />
{/if}
