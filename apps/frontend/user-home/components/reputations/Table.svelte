<script lang="ts">
    import find from 'lodash/find'

    import { settingsStore } from '@/shared/stores/settings'
    import { staticStore } from '@/shared/stores/static'
    import { manualStore } from '@/stores';
    import { reputationState } from '@/stores/local-storage'
    import { leftPad } from '@/utils/formatting'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { Character } from '@/types'
    import type { ManualDataReputationCategory, ManualDataReputationSet } from '@/types/data/manual';

    import AccountWide from './AccountWide.svelte';
    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Error from '@/components/common/Error.svelte'
    import TableHead from './TableHead.svelte'
    import TableCell from './TableCell.svelte'
    import TableCellRenown from './TableCellRenown.svelte'

    export let slug: string

    let category: ManualDataReputationCategory
    let sorted: boolean
    let filterFunc: (char: Character) => boolean
    let sortFunc: (char: Character) => string
    $: {
        category = find($manualStore.reputationSets, (r) => r?.slug === slug)
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

    function isRenown(reputationSet: ManualDataReputationSet) {
        return reputationSet.both
            ? $staticStore.reputations[reputationSet.both.id].renownCurrencyId > 0
            : $staticStore.reputations[reputationSet.alliance?.id || reputationSet.horde.id].renownCurrencyId > 0
    }

    type RepSetData = [ManualDataReputationSet[], number][];
    function splitSets(reputationSets: ManualDataReputationSet[][]): [RepSetData, RepSetData] {
        const accountSets: RepSetData = [];
        const characterSets: RepSetData = [];

        for (let setIndex = 0; setIndex < reputationSets.length; setIndex++) {
            const reputationSet = reputationSets[setIndex];
            const hasAccountWide = reputationSet.some((rep) => $staticStore.reputations[rep.both?.id]?.accountWide);
            (hasAccountWide ? accountSets : characterSets).push([reputationSet, setIndex]);
        }

        return [accountSets, characterSets];
    }
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: start;
        gap: 1rem;
    }
</style>

{#if category?.reputations?.length > 0}
{@const [accountSets, characterSets] = splitSets(category.reputations)}
    <div class="flex-wrapper">
    {#if accountSets.length > 0}
        <AccountWide {accountSets} {slug} />
    {/if}

    {#if characterSets.length > 0}
        <CharacterTable
            skipGrouping={sorted}
            skipIgnored={true}
            {filterFunc}
            {sortFunc}
        >
            <CharacterTableHead slot="head">
                {#each characterSets as [reputationSet]}
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
                    {#each characterSets as [reputationSets, reputationsIndex]}
                        <td class="spacer"></td>

                        {#each reputationSets as reputationSet, reputationSetsIndex}
                            {#if isRenown(reputationSet)}
                                <TableCellRenown
                                    reputation={reputationSet}
                                    {character}
                                    {slug}
                                    {reputationsIndex}
                                    {reputationSetsIndex}
                                />
                            {:else}
                                <TableCell
                                    reputation={reputationSet}
                                    {character}
                                    {slug}
                                    {reputationsIndex}
                                    {reputationSetsIndex}
                                />
                            {/if}
                        {/each}
                    {/each}
                {/key}
            </svelte:fragment>
        </CharacterTable>
    {/if}
    </div>
{:else}
    <Error
        text="No reputations found matching provided path"
    />
{/if}
