import { costOrderMap } from '@/data/vendors';
import { wowthingData } from '@/shared/stores/data';
import { leftPad } from '@/utils/formatting';
import { toNiceNumber } from '@/utils/formatting';
import type { StaticData } from '@/shared/stores/static/types';

type CurrencyArray = [string, number, string, number, number];

export function getCurrencyCosts(
    staticData: StaticData,
    costs: Record<number, number>,
    skipCostOrder?: boolean,
    skipNiceNumbers?: boolean
): CurrencyArray[] {
    const temp: [string, CurrencyArray][] = [];

    const currencyIds = Object.keys(costs).map((currencyId) => parseInt(currencyId));

    for (const currencyId of currencyIds) {
        const currencyData: CurrencyArray = [
            currencyId > 1000000 ? 'item' : 'currency',
            currencyId > 1000000 ? currencyId - 1000000 : currencyId,
            skipNiceNumbers === true
                ? costs[currencyId].toLocaleString()
                : toNiceNumber(costs[currencyId]),
            currencyId,
            costs[currencyId],
        ];

        let sortKey: string;

        const index = costOrderMap[currencyId] || -1;
        if (skipCostOrder !== true && index >= 0) {
            sortKey = leftPad(index, 6, '0');
        } else if (currencyData[0] === 'item') {
            const item = wowthingData.items.items[currencyData[1]];
            sortKey = [
                '999999',
                leftPad(999_999_999 - currencyData[4], 9, '0'),
                leftPad(10 - (item?.quality ?? 0), 2, '0'),
                item?.name ?? 'ZZZ',
            ].join('|');
        } else {
            sortKey = [
                '555555',
                leftPad(999_999_999 - currencyData[4], 9, '0'),
                staticData.currencies[currencyData[1]]?.name ?? 'ZZZ',
            ].join('|');
        }

        temp.push([sortKey, currencyData]);
    }

    temp.sort();
    return temp.map(([, currencyData]) => currencyData);
}

export function getCurrencyCostsString(
    staticData: StaticData,
    costs: Record<number, number>,
    reputation?: number[]
): string {
    const parts: string[] = [];
    const sortedCosts = getCurrencyCosts(staticData, costs);
    for (const [type, , , id, value] of sortedCosts) {
        let price: string;
        if (type === 'currency' && id === 0) {
            price = `${value}`;
        } else {
            price = `${value}|${id}`;
        }

        if (reputation?.length === 2) {
            parts.push(`{repPrice:${reputation[0]}|${reputation[1]}|${price}}`);
        } else {
            parts.push(`{price:${price}}`);
        }
    }
    return parts.join(', ');
}

export function getSetCurrencyCostsString(
    staticData: StaticData,
    allAppearanceIds: number[][],
    costses: Record<number, number>[],
    haveFunc: (appearanceId: number) => boolean
): string {
    const totalCosts: Record<number, number> = {};
    for (let i = 0; i < allAppearanceIds.length; i++) {
        if (allAppearanceIds[i].every((appearanceId: number) => haveFunc(appearanceId))) {
            continue;
        }

        for (const key in costses[i]) {
            const keyNumber = parseInt(key);
            totalCosts[keyNumber] = (totalCosts[keyNumber] || 0) + costses[i][keyNumber];
        }
    }
    return getCurrencyCostsString(staticData, totalCosts);
}
