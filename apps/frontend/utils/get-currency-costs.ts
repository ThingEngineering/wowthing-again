import sortBy from 'lodash/sortBy'

import { costOrder } from '@/data/vendors'
import toDigits from '@/utils/to-digits'
import { toNiceNumber } from '@/utils/to-nice'
import type { ManualData } from '@/types/data/manual'


export function getCurrencyCosts(
    manualData: ManualData,
    costs: Record<number, number>
): [string, number, string, number, number][] {
    const ret: [string, number, string, number, number][] = []

    const currencyIds = Object.keys(costs)
        .map((currencyId) => parseInt(currencyId))
    
    for (const currencyId of currencyIds) {
        ret.push([
            currencyId > 1000000 ? 'item' : 'currency',
            currencyId > 1000000 ? currencyId - 1000000 : currencyId,
            toNiceNumber(costs[currencyId]),
            currencyId,
            costs[currencyId],
        ])
    }

   return sortBy(
        ret,
        ([type, id, , originalId, value]) => {
            const index = costOrder.indexOf(originalId)
            if (index >= 0) {
                return toDigits(index, 6)
            }

            if (type === 'item') {
                const item = manualData.shared.items[id]
                return [
                    '999999',
                    toDigits(999999 - value, 6),
                    toDigits(10 - item?.quality ?? 0, 2),
                    item?.name ?? 'ZZZ',
                ].join('|')
            }

            return `555555$|${toDigits(999999 - value, 6)}|{staticData.currencies[id]?.name ?? 'ZZZ'}`
        }
    )
}

export function getCurrencyCostsString(
    manualData: ManualData,
    costs: Record<number, number>,
    reputation?: number[]
): string {
    const parts: string[] = []
    const sortedCosts = getCurrencyCosts(manualData, costs)
    for (const [type, , , id, value] of sortedCosts) {
        let price: string
        if (type === 'currency' && id === 0) {
            price = `${value}`
        }
        else {
            price = `${value}|${id}`
        }

        if (reputation?.length === 2) {
            parts.push(`{repPrice:${reputation[0]}|${reputation[1]}|${price}}`)
        }
        else {
            parts.push(`{price:${price}}`)
        }
    }
    return parts.join(', ')
}

export function getSetCurrencyCostsString(
    manualData: ManualData,
    appearanceIds: number[],
    costses: Record<number, number>[],
    haveFunc: (appearanceId: number) => boolean
): string {
    const totalCosts: Record<number, number> = {}
    for (let i = 0; i < appearanceIds.length; i++) {
        if (haveFunc(appearanceIds[i])) {
            continue
        }

        for (const key in costses[i]) {
            const keyNumber = parseInt(key)
            totalCosts[keyNumber] = (totalCosts[keyNumber] || 0) + costses[i][keyNumber]
        }
    }
    return getCurrencyCostsString(manualData, totalCosts)
}
