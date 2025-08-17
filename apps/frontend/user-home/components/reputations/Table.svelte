<script lang="ts">
    import find from 'lodash/find';

    import { wowthingData } from '@/shared/stores/data';
    import { reputationState } from '@/stores/local-storage';
    import { leftPad } from '@/utils/formatting';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { Character } from '@/types';
    import type {
        ManualDataReputationCategory,
        ManualDataReputationSet,
    } from '@/types/data/manual';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import Error from '@/components/common/Error.svelte';
    import TableHead from './TableHead.svelte';
    import TableCell from './TableCell.svelte';
    import TableCellRenown from './TableCellRenown.svelte';

    export let characterSets: [ManualDataReputationSet[], number][];
    export let slug: string;

    let category: ManualDataReputationCategory;
    let sorted: boolean;
    let filterFunc: (char: Character) => boolean;
    let sortFunc: (char: Character) => string;
    $: {
        category = find(wowthingData.manual.reputationSets, (r) => r?.slug === slug);
        if (!category) {
            break $;
        }

        filterFunc = (char: Character) => char.level >= (category.minimumLevel ?? 0);

        const order: number[] = $reputationState.sortOrder[slug];
        if (order?.length > 0) {
            sorted = true;
            sortFunc = (char) => {
                let repValue = -1;
                let paragonValue = -1;
                for (const repId of order) {
                    repValue = Math.max(repValue, char.reputations?.[repId] ?? -1);
                    const paragon = char.paragons?.[repId];
                    if (paragon) {
                        if (paragon.rewardAvailable) {
                            paragonValue = 99999;
                        } else {
                            paragonValue = paragon.current;
                        }
                    }
                }

                return [
                    leftPad(100000 - repValue, 6, '0'),
                    leftPad(10000 - paragonValue, 6, '0'),
                ].join('|');
            };
        } else {
            sorted = false;
            sortFunc = $getCharacterSortFunc();
        }
    }

    function isRenown(reputationSet: ManualDataReputationSet) {
        return reputationSet.both
            ? wowthingData.static.reputationById.get(reputationSet.both.id).renownCurrencyId > 0
            : wowthingData.static.reputationById.get(
                  reputationSet.alliance?.id || reputationSet.horde.id
              ).renownCurrencyId > 0;
    }
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: start;
        gap: 1rem;
    }
</style>

{#if category?.reputations?.length > 0}
    <div class="flex-wrapper">
        {#if characterSets.length > 0}
            <CharacterTable skipGrouping={sorted} skipIgnored={true} {filterFunc} {sortFunc}>
                <CharacterTableHead slot="head">
                    {#each characterSets as [reputationSet] (reputationSet)}
                        <td class="spacer"></td>

                        {#each reputationSet as reputation (reputation)}
                            <TableHead {reputation} {slug} />
                        {/each}
                    {/each}
                </CharacterTableHead>

                <svelte:fragment slot="rowExtra" let:character>
                    {#key `reputations|${slug}`}
                        {#each characterSets as [reputationSets, reputationsIndex] (reputationSets)}
                            <td class="spacer"></td>

                            {#each reputationSets as reputationSet, reputationSetsIndex (reputationSet)}
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
    <Error text="No reputations found matching provided path" />
{/if}
