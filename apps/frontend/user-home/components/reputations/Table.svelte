<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
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

    type Props = {
        category: ManualDataReputationCategory;
        characterSets: [ManualDataReputationSet[], number][];
        slug: string;
    };
    let { category, characterSets, slug }: Props = $props();

    let filterFunc = $derived((char: Character) => char.level >= (category.minimumLevel ?? 0));

    let [sorted, sortFunc]: [boolean, (char: Character) => string] = $derived.by(() => {
        const order: number[] = browserState.current.reputations.sortOrder[slug];
        if (order?.length > 0) {
            return [
                true,
                (char) => {
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
                },
            ];
        } else {
            return [false, getCharacterSortFunc()];
        }
    });

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
