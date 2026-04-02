<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Constants } from '@/data/constants';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { getProfessionSortKey } from '@/utils/professions';
    import type { CharacterProps } from '@/types/props';

    import Currency from '@/shared/components/currencies/Currency.svelte';

    type Props = CharacterProps & { expansion: number };
    let { character, expansion }: Props = $props();

    let concentrationData = $derived(expansionProfessionConcentration[expansion]);
    let professions = $derived.by(() =>
        sortBy(
            Object.keys(concentrationData)
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
        --width: calc(var(--width-profession) * 2);

        border-left: 1px solid var(--border-color);
        text-align: right;
        word-spacing: -0.2ch;
    }
    .flex-wrapper {
        width: 100%;
    }
    .faded {
        opacity: 0.7;
    }
    .concentration {
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
        {#each professions as profession, index (index)}
            <Currency
                {character}
                currency={wowthingData.static.currencyById.get(concentrationData[profession.id])}
                fullIsBad={settingsState.value.professions.fullConcentrationIsBad}
                useStatusClass={true}
            />
        {/each}
    </div>
</td>
