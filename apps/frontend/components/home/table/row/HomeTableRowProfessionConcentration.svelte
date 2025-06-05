<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { imageStrings } from '@/data/icons';
    import { professionConcentration } from '@/data/professions/cooldowns';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import { getProfessionSortKey } from '@/utils/professions';
    import type { Character } from '@/types';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';

    export let character: Character;

    $: professions = sortBy(
        Object.values($staticStore.professions).filter(
            (prof) => professionConcentration[prof.id] && character.professions?.[prof.id]
        ),
        (prof) => getProfessionSortKey(prof)
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
        @include cell-width($width-professions);

        border-left: 1px solid $border-color;
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
                userStore,
                character,
                $staticStore.currencies[professionConcentration[profession.id]]
            )}
            <div
                class="concentration {statusClass(
                    settingsState.value.professions.fullConcentrationIsBad,
                    percent
                )}"
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
