<script lang="ts">
    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { expansionProfessionConcentration } from '@/data/professions/cooldowns';
    import { professionMoxie } from '@/data/professions/moxie';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips/component-tooltip.svelte';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { CharacterSubProfession } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import Currency from '@/shared/components/currencies/Currency.svelte';
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
    let moxieCurrency = $derived(
        wowthingData.static.currencyById.get(professionMoxie[profession.id])
    );
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
                <Currency
                    {character}
                    currency={concCurrency}
                    fullIsBad={settingsState.value.professions.fullConcentrationIsBad}
                    useStatusClass={true}
                />
            {:else if field === 'moxie' && showMoxie}
                <Currency {character} currency={moxieCurrency} />
            {/if}
        {/each}
    {/if}
</div>
