<script lang="ts">
    import { getCharacterTableContext } from '@/components/character-table/context';
    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { professionMoxie } from '@/data/professions/moxie';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { componentTooltip } from '@/shared/utils/tooltips/component-tooltip.svelte';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { character }: CharacterProps = $props();

    const { characters: visibleCharacters } = getCharacterTableContext()();
    let [anyConcentration, anyMoxie] = $derived.by(() => {
        const professionIds = visibleCharacters.map((char) =>
            char.professionData.map(([prof, , isCurrent]) => [prof.id, isCurrent])
        ) as [number, boolean][][];

        const retConcentration = [
            professionIds.some((data) => data[0]?.[1] && !!concentrationData[data[0][0]]),
            professionIds.some((data) => data[1]?.[1] && !!concentrationData[data[1][0]]),
        ];
        const retMoxie = [
            professionIds.some((data) => data[0]?.[1] && !!professionMoxie[data[0][0]]),
            professionIds.some((data) => data[1]?.[1] && !!professionMoxie[data[1][0]]),
        ];

        return [retConcentration, retMoxie];
    });

    let concentrationData = $derived(expansionProfessionConcentration[Constants.expansion]);
    let professions = $derived(character.professionData);

    // TODO: derive from settings state
    let fields = $derived(['concentration', 'moxie']);

    let columnCounts = $derived([
        1 +
            (fields.includes('concentration') && anyConcentration[0] ? 1 : 0) +
            (fields.includes('moxie') && anyMoxie[0] ? 1 : 0),
        1 +
            (fields.includes('concentration') && anyConcentration[1] ? 1 : 0) +
            (fields.includes('moxie') && anyMoxie[1] ? 1 : 0),
    ]);

    function statusClass(fullIsBad: boolean, percent: number) {
        if (percent >= 100) {
            return fullIsBad ? 'status-fail' : 'status-success';
        } else if (percent >= 75) {
            return fullIsBad ? 'status-warn' : 'status-shrug';
        } else if (percent > 25 && percent < 75) {
            return fullIsBad ? 'status-shrug' : 'status-warn';
        } else {
            return fullIsBad ? 'status-success' : 'status-fail';
        }
    }
</script>

<style lang="scss">
    td {
        --profession-width: 3.5rem;

        padding-left: 0;
        padding-right: 0;
    }
    .flex-wrapper {
        flex-wrap: nowrap;
        gap: 0.3rem;
        width: 100%;
    }
    .professions {
        display: grid;
        width: 100%;
    }
    .profession {
        align-items: center;
        align-self: center;
        display: grid;
        flex-wrap: nowrap;
        gap: 0.4rem;
        grid-template-columns: repeat(var(--columns), var(--profession-width));
        padding: 0 0.3rem;

        > * {
            width: var(--profession-width);
        }
    }
    a {
        --image-margin-top: 0;

        align-items: center;
        color: var(--color-body-text);
        display: flex;
        justify-content: space-between;
    }
    .concentration,
    .moxie {
        align-items: center;
        display: flex;
        gap: 0.2rem;
        justify-content: space-between;

        &:not(:first-child) {
            --image-margin-top: 0;
        }
    }
</style>

<td class="b-l">
    <div class="professions" style:grid-template-columns="{columnCounts[0]}fr {columnCounts[1]}fr">
        {#each professions as [profession, charProfession, current], index (profession.id)}
            {@const currentSkill = charProfession?.skillCurrent || 0}
            <div
                class="profession"
                class:b-l={index > 0}
                style:--columns={columnCounts[index]}
                data-id={profession.id}
            >
                <a
                    href="#/characters/{Region[character.realm.region].toLowerCase()}-{character
                        .realm.slug}/{character.name}/professions/{profession.slug}"
                    use:componentTooltip={{
                        component: Tooltip,
                        props: {
                            character,
                            profession,
                        },
                    }}
                >
                    <WowthingImage name={imageStrings[profession.slug]} size={20} border={1} />
                    <span
                        class:status-fail={!current || currentSkill === 0}
                        class:status-success={current &&
                            currentSkill > 0 &&
                            currentSkill >= charProfession.skillMax}
                    >
                        {currentSkill || '---'}
                    </span>
                </a>

                {#if current}
                    {#each fields as field (field)}
                        {#if field === 'concentration' && anyConcentration[index]}
                            {@const concCurrency = wowthingData.static.currencyById.get(
                                concentrationData[profession.id]
                            )}
                            {#if concCurrency}
                                {@const { amount, percent, tooltip } = getCurrencyData(
                                    $timeStore,
                                    character,
                                    concCurrency
                                )}
                                {@const status = statusClass(
                                    settingsState.value.professions.fullConcentrationIsBad,
                                    percent
                                )}
                                <div class="concentration {status}" data-tooltip={tooltip}>
                                    <WowthingImage
                                        name="currency/{concCurrency.id}"
                                        size={20}
                                        border={1}
                                    />
                                    <span>{amount}</span>
                                </div>
                            {:else}
                                <div class="concentration"></div>
                            {/if}
                        {:else if field === 'moxie' && anyMoxie[index]}
                            {@const moxieCurrency = wowthingData.static.currencyById.get(
                                professionMoxie[profession.id]
                            )}
                            {#if moxieCurrency}
                                {@const { amount, tooltip } = getCurrencyData(
                                    $timeStore,
                                    character,
                                    moxieCurrency
                                )}
                                <div class="moxie" data-tooltip={tooltip}>
                                    <WowthingImage
                                        name="currency/{moxieCurrency.id}"
                                        size={20}
                                        border={1}
                                    />
                                    <span>{amount}</span>
                                </div>
                            {:else}
                                <div class="moxie"></div>
                            {/if}
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</td>
