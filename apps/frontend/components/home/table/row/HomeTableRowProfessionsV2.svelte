<script lang="ts">
    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { professionMoxie } from '@/data/professions/moxie';
    import { ProfessionType } from '@/enums/profession-type';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { componentTooltip } from '@/shared/utils/tooltips/component-tooltip.svelte';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import { getProfessionSortKey } from '@/utils/professions/get-profession-sort-key';
    import type { StaticDataProfession } from '@/shared/stores/static/types/profession';
    import type { CharacterSubProfession } from '@/types/character/profession.svelte';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { character }: CharacterProps = $props();

    let concentrationData = $derived(expansionProfessionConcentration[Constants.expansion]);
    let professions = $derived.by(() => {
        const ret: [StaticDataProfession, CharacterSubProfession, boolean][] = [];

        for (const staticProfession of wowthingData.static.professionById.values()) {
            if (staticProfession?.type !== ProfessionType.Primary) {
                continue;
            }

            let best: [CharacterSubProfession, number];
            for (const expansion of settingsState.expansions) {
                const subProfession = staticProfession.expansionSubProfession[expansion.id];
                if (subProfession) {
                    const characterSubProfession =
                        character.professions[staticProfession.id]?.subProfessions?.[
                            subProfession.id
                        ];
                    if (characterSubProfession && expansion.id >= (best?.[1] || 0)) {
                        best = [characterSubProfession, expansion.id];
                    }
                }
            }

            if (best) {
                ret.push([staticProfession, best[0], best[1] === Constants.expansion]);
            }
        }

        ret.sort((a, b) => getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0])));

        return ret;
    });

    let fields = $derived(['concentration', 'moxie']);

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
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
    .profession {
        align-items: center;
        align-self: center;
        display: grid;
        flex-wrap: nowrap;
        gap: 0.4rem;
        grid-template-columns: repeat(var(--columns), 1fr);
        padding: 0 0.3rem;
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
    <div class="professions">
        {#each professions as [profession, charProfession, current], index (profession.id)}
            {@const currentSkill = charProfession?.skillCurrent || 0}
            <div
                class="profession"
                class:b-l={index > 0}
                style:--columns={1 + fields.length}
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
                        {#if field === 'concentration'}
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
                        {:else if field === 'moxie'}
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
