<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { imageStrings } from '@/data/icons';
    import { professionConcentration } from '@/data/professions/cooldowns';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import { getProfessionSortKey } from '@/utils/professions';
    import type { CharacterProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { Constants } from '@/data/constants';

    let { character }: CharacterProps = $props();

    let professions = $derived.by(() =>
        sortBy(
            Object.keys(professionConcentration)
                .filter((professionIdString) => {
                    const professionId = parseInt(professionIdString);
                    const profession = wowthingData.static.professionById.get(professionId);
                    const charProf = character.professions?.[professionId];
                    const subProfession = profession.expansionSubProfession[Constants.expansion];
                    return (
                        !!charProf && charProf.subProfessions[subProfession.id]?.skillCurrent >= 50
                    );
                })
                .map((id) => wowthingData.static.professionById.get(parseInt(id))),
            (prof) => getProfessionSortKey(prof)
        )
    );

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
        {#each professions as profession}
            {@const { amount, percent, tooltip } = getCurrencyData(
                $timeStore,
                character,
                wowthingData.static.currencyById.get(professionConcentration[profession.id])
            )}
            <div
                class="concentration {statusClass(
                    settingsState.value.professions.fullConcentrationIsBad,
                    percent
                )}"
                class:faded={['leatherworking', 'tailoring'].includes(profession.slug)}
                use:basicTooltip={{
                    allowHTML: true,
                    content: tooltip,
                }}
            >
                <WowthingImage name={imageStrings[profession.slug]} size={20} border={1} />
                <span>{amount}</span>
            </div>
        {/each}
    </div>
</td>
