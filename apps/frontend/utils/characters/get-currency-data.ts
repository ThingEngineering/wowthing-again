import type { DateTime } from 'luxon';

import { toNiceDuration, toNiceNumber } from '../formatting';
import { currencyItemCurrencies, currencyProfession } from '@/data/currencies';
import { CharacterCurrency, type Character } from '@/types/character';
import type { StaticDataCurrency } from '@/shared/stores/static/types';
import type { UserDataStore } from '@/stores';
import type { ItemData } from '@/types/data/item';

interface CharacterCurrencyData {
    amount: string;
    capRemaining: number;
    percent: number;
    tooltip: string;
}

export function getCurrencyData(
    itemData: ItemData,
    time: DateTime,
    userStore: UserDataStore,
    character: Character,
    currency: StaticDataCurrency = undefined,
    itemId: number = 0,
): CharacterCurrencyData {
    const ret: CharacterCurrencyData = {
        amount: '',
        capRemaining: 0,
        percent: 0,
        tooltip: '',
    };

    if (currency) {
        let characterCurrency: CharacterCurrency;
        if (
            currencyProfession[currency.id] &&
            !character.professions?.[currencyProfession[currency.id]]
        ) {
            characterCurrency = new CharacterCurrency(currency.id);
        } else {
            characterCurrency =
                character.currencies?.[currency.id] || new CharacterCurrency(currency.id);
        }

        let extraTooltip: string;
        let amount = characterCurrency.quantity;
        if (currency.rechargeInterval > 0 && currency.maxTotal > 0 && character.scannedCurrencies) {
            const diff = time.diff(character.scannedCurrencies).toMillis();
            if (diff >= currency.rechargeInterval) {
                amount = Math.min(
                    characterCurrency.max,
                    amount + Math.floor(diff / currency.rechargeInterval) * currency.rechargeAmount,
                );
                if (amount < characterCurrency.max) {
                    const remainingTime =
                        ((characterCurrency.max - amount) / currency.rechargeAmount) *
                            currency.rechargeInterval -
                        (diff % currency.rechargeInterval);
                    extraTooltip = `${toNiceDuration(remainingTime)} to max!`;
                }
            }
        }

        ret.amount = toNiceNumber(amount);

        if (characterCurrency.isMovingMax && characterCurrency.max > 0) {
            ret.capRemaining = characterCurrency.max - characterCurrency.totalQuantity;
            ret.percent = (characterCurrency.totalQuantity / characterCurrency.max) * 100;
            ret.tooltip = `${characterCurrency.totalQuantity.toLocaleString()} / ${characterCurrency.max.toLocaleString()}`;
        } else {
            if (characterCurrency.max > 0) {
                ret.capRemaining = characterCurrency.max - amount;
                ret.percent = (amount / characterCurrency.max) * 100;
                ret.tooltip = `${amount.toLocaleString()} / ${characterCurrency.max.toLocaleString()}`;
            } else {
                ret.percent = 0;
                ret.tooltip = amount.toLocaleString();
            }
        }
        ret.tooltip += ` ${currency.name}`;

        if (extraTooltip) {
            ret.tooltip += `<br><br>${extraTooltip}`;
        }
    } else {
        const characterItemCount = character.getItemCount(itemId);
        const item = itemData.items[itemId];
        const name = item?.name || `Item #${itemId}`;

        ret.amount = toNiceNumber(characterItemCount);
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
    }

    return ret;
}
