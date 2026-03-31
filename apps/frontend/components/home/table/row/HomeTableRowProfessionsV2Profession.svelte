<script lang="ts">
    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { professionMoxie } from '@/data/professions/moxie';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { timeState } from '@/shared/state/time.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips/component-tooltip.svelte';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { CharacterSubProfession } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = CharacterProps & {
        charProfession: CharacterSubProfession;
        columns: number;
        current: boolean;
        fields: string[];
        profession: StaticDataProfession;
        showConcentration: boolean;
        showMoxie: boolean;
    };
    let {
        character,
        charProfession,
        columns,
        current,
        fields,
        profession,
        showConcentration,
        showMoxie,
    }: Props = $props();

    const concentrationData = expansionProfessionConcentration[Constants.expansion];

    let currentSkill = $derived(charProfession.skillCurrent || 0);

    let concCurrency = $derived(
        wowthingData.static.currencyById.get(concentrationData[profession.id])
    );
    let concData = $derived(
        concCurrency && getCurrencyData(timeState.slowTime, character, concCurrency)
    );

    let moxieCurrency = $derived(
        wowthingData.static.currencyById.get(professionMoxie[profession.id])
    );
    let moxieData = $derived(
        moxieCurrency && getCurrencyData(timeState.slowTime, character, moxieCurrency)
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

<div class="profession" style:--columns={columns} data-id={profession.id}>
    <a
        href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm
            .slug}/{character.name}/professions/{profession.slug}"
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
            {#if field === 'concentration' && showConcentration}
                {#if concData}
                    {@const { amount, percent, tooltip } = concData}
                    {@const status = statusClass(
                        settingsState.value.professions.fullConcentrationIsBad,
                        percent
                    )}
                    <div class="concentration {status}" data-tooltip={tooltip}>
                        <WowthingImage name="currency/{concCurrency.id}" size={20} border={1} />
                        <span>{amount}</span>
                    </div>
                {:else}
                    <div class="concentration"></div>
                {/if}
            {:else if field === 'moxie' && showMoxie}
                {#if moxieData}
                    {@const { amount, tooltip } = moxieData}
                    <div class="moxie" data-tooltip={tooltip}>
                        <WowthingImage name="currency/{moxieCurrency.id}" size={20} border={1} />
                        <span>{amount}</span>
                    </div>
                {:else}
                    <div class="moxie"></div>
                {/if}
            {/if}
        {/each}
    {/if}
</div>
