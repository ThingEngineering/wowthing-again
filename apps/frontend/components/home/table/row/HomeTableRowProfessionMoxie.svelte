<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Constants } from '@/data/constants';
    import { professionMoxie } from '@/data/professions/moxie';
    import { wowthingData } from '@/shared/stores/data';
    import { getProfessionSortKey } from '@/utils/professions';
    import type { CharacterProps } from '@/types/props';

    import Currency from '@/shared/components/currencies/Currency.svelte';

    let { character }: CharacterProps = $props();

    let professions = $derived.by(() =>
        sortBy(
            Object.keys(professionMoxie)
                .filter((professionIdString) => {
                    const professionId = parseInt(professionIdString);
                    const profession = wowthingData.static.professionById.get(professionId);
                    const charProf = character.professions?.[professionId];
                    const subProfession = profession.expansionSubProfession[Constants.expansion];
                    return (
                        !!charProf && charProf.subProfessions[subProfession.id]?.skillCurrent >= 1
                    );
                })
                .map((id) => wowthingData.static.professionById.get(parseInt(id))),
            (prof) => getProfessionSortKey(prof)
        )
    );
</script>

<style lang="scss">
    td {
        --padding-left: 0;
        --padding-right: 0;
        --profession-width: 3.6rem;
        --width: calc(var(--profession-width) * 2);

        border-left: 1px solid var(--border-color);
        text-align: right;
        word-spacing: -0.2ch;
    }
    .flex-wrapper {
        width: 100%;
        align-items: center;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(2, var(--profession-width));
        padding: 0 0.3rem;

        :global(.currency) {
            --image-margin-top: 0;

            align-items: center;
            display: flex;
            justify-content: space-between;
        }
    }
    .faded {
        opacity: 0.7;
    }
    .moxie {
        align-items: center;
        display: flex;
        justify-content: space-between;

        span {
            display: block;
            text-align: right;
            width: 2.3rem;
        }
    }
</style>

<td>
    <div class="flex-wrapper">
        {#each professions as profession (profession.id)}
            {@const moxieCurrency = wowthingData.static.currencyById.get(
                professionMoxie[profession.id]
            )}
            <Currency {character} currency={moxieCurrency} />
        {/each}
    </div>
</td>
