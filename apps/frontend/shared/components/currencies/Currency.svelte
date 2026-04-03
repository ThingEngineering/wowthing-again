<script lang="ts">
    import { currencyIconOverride } from '@/data/currencies';
    import { timeState } from '@/shared/state/time.svelte';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';
    import type { CharacterProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = CharacterProps & {
        currency: StaticDataCurrency;
        fullIsBad?: boolean;
        useIconOverride?: boolean;
        useStatusClass?: boolean;
    };
    let {
        character,
        currency,
        fullIsBad,
        useIconOverride = true,
        useStatusClass,
    }: Props = $props();

    let data = $derived(currency && getCurrencyData(timeState.slowTime, character, currency));

    function statusClass(percent: number) {
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
    .currency {
        align-items: center;
        display: flex;
        gap: 0.2rem;
        justify-content: space-between;
    }
</style>

{#if data}
    {@const { amount, percent, tooltip } = data}
    {@const status = useStatusClass ? statusClass(percent) : ''}
    {@const icon = useIconOverride ? currencyIconOverride[currency.id] : ''}
    <div class="currency {status}" data-tooltip={tooltip}>
        <WowthingImage name={icon || `currency/${currency.id}`} size={20} border={1} />
        <span>{amount}</span>
    </div>
{:else}
    <div class="currency"></div>
{/if}
