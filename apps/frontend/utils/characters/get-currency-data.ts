import type { DateTime } from 'luxon';

import { toNiceDuration, toNiceNumber } from '../formatting';
import {
    currencyItemCurrencies,
    currencyProfession,
    currencyShowRemaining,
} from '@/data/currencies';
import { wowthingData } from '@/shared/stores/data';
import { userStore } from '@/stores/user';
import { CharacterCurrency, type Character } from '@/types/character';
import { userState } from '@/user-home/state/user';
import type { StaticDataCurrency } from '@/shared/stores/static/types';

interface CharacterCurrencyData {
    amount: string;
    amountRaw: number;
    capRemaining: number;
    percent: number;
    tooltip: string;
    weekAmount: number;
    weekMax: number;
}

export function getCurrencyData(
    time: DateTime,
    character: Character,
    currency: StaticDataCurrency = undefined,
    itemId: number = 0
): CharacterCurrencyData {
    const ret: CharacterCurrencyData = {
        amount: '',
        amountRaw: 0,
        capRemaining: 0,
        percent: 0,
        tooltip: '',
        weekAmount: 0,
        weekMax: 0,
    };

    if (currency) {
        let characterCurrency: CharacterCurrency;
        if (currency.isAccountWide) {
            characterCurrency = userState.accountCurrency(currency.id);
        } else if (
            currencyProfession[currency.id] &&
            !character.professions?.[currencyProfession[currency.id]]
        ) {
            characterCurrency = new CharacterCurrency(currency.id);
        } else {
            characterCurrency =
                character.currencies?.[currency.id] || new CharacterCurrency(currency.id);
        }

        let extraTooltip: string;
        if (characterCurrency.remainingTime) {
            extraTooltip = `${toNiceDuration(characterCurrency.remainingTime)} to max!`;
        }

        const amount = characterCurrency.quantity;
        ret.amount = toNiceNumber(amount);
        ret.amountRaw = amount;
        ret.weekAmount = characterCurrency.weekQuantity;
        ret.weekMax = characterCurrency.weekMax;

        if (characterCurrency.isMovingMax && characterCurrency.max > 0) {
            ret.capRemaining = characterCurrency.max - characterCurrency.totalQuantity;
            ret.percent = (characterCurrency.totalQuantity / characterCurrency.max) * 100;
            ret.tooltip = `${characterCurrency.totalQuantity.toLocaleString()} / ${characterCurrency.max.toLocaleString()}`;
        } else {
            ret.tooltip = amount.toLocaleString();

            if (characterCurrency.max > 0) {
                ret.capRemaining = characterCurrency.max - amount;
                ret.percent = (amount / characterCurrency.max) * 100;
                ret.tooltip = `${ret.tooltip} / ${characterCurrency.max.toLocaleString()}`;
            } else if (characterCurrency.weekMax > 0) {
                ret.capRemaining = characterCurrency.weekMax - characterCurrency.weekQuantity;
                ret.percent = (characterCurrency.weekQuantity / characterCurrency.weekMax) * 100;
                extraTooltip = `${characterCurrency.weekQuantity.toLocaleString()} / ${characterCurrency.weekMax.toLocaleString()} weekly cap`;
            } else {
                ret.percent = 0;
            }
        }
        ret.tooltip += ` ${currency.name}`;

        if (extraTooltip) {
            ret.tooltip += `<br><br>${extraTooltip}`;
        }
    } else {
        const item = wowthingData.items.items[itemId];
        const name = item?.name || `Item #${itemId}`;

        if (character) {
            const characterItemCount = character.getItemCount(itemId);

            ret.amount = toNiceNumber(characterItemCount);
            ret.amountRaw = characterItemCount;
            ret.tooltip = `${characterItemCount.toLocaleString()}x ${name}`;

            if (currencyItemCurrencies[itemId]) {
                const characterCurrency = character.currencies?.[currencyItemCurrencies[itemId]];
                if (characterCurrency?.max > 0) {
                    ret.capRemaining = characterCurrency.max - characterCurrency.quantity;
                    ret.percent = (characterCurrency.quantity / characterCurrency.max) * 100;
                    ret.tooltip += ` &ndash; ${characterCurrency.quantity} / ${characterCurrency.max}`;
                }
            }
            // This has a backing currency which does not have a max, whee
            else if (itemId === 211515) {
                const characterCurrency = character.currencies?.[2800];
                const quantity = characterCurrency?.quantity || 0;

                const period = userStore.getCurrentPeriodForCharacter(time, character);
                const max = period.id - 954;

                ret.percent = (quantity / max) * 100;
                ret.tooltip += ` &ndash; ${quantity} / ${max}`;
            } else if (item?.unique > 0) {
                ret.percent = (characterItemCount / item.unique) * 100;
                ret.tooltip = ret.tooltip.replace('x ', ` / ${item.unique} `);
            }
        } else {
            const warbankItems = userState.general.warbankItemsByItemId[itemId] || [];
            const quantity = warbankItems.reduce((a, b) => a + b.count, 0);
            ret.amount = toNiceNumber(quantity);
            ret.tooltip = `${quantity.toLocaleString()}x ${name}`;
        }
    }

    if (currencyShowRemaining.has(currency?.id) && ret.tooltip.startsWith(`${ret.amount} / `)) {
        const { amountRaw, capRemaining } = ret;
        ret.amountRaw = capRemaining;
        ret.capRemaining = amountRaw;
        ret.amount = ret.amountRaw.toString();
    }

    return ret;
}
