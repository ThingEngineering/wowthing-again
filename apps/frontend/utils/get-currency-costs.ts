import sortBy from 'lodash/sortBy'

import { costOrder } from '@/data/vendors'
import toDigits from '@/utils/to-digits'
import { toNiceNumber } from '@/utils/to-nice'
import type { ManualData } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'


export function getCurrencyCosts(
    manualData: ManualData,
    staticData: StaticData,
    costs: Record<number, number>
): [string, number, string, number][] {
    const ret: [string, number, string, number][] = []

    const currencyIds = Object.keys(costs)
        .map((currencyId) => parseInt(currencyId))
    
    for (const currencyId of currencyIds) {
        ret.push([
            currencyId > 1000000 ? 'item' : 'currency',
            currencyId > 1000000 ? currencyId - 1000000 : currencyId,
            toNiceNumber(costs[currencyId]),
            currencyId,
        ])
    }

    return sortBy(
        ret,
        ([type, id, , originalId]) => {
            const index = costOrder.indexOf(originalId)
            if (index >= 0) {
                return toDigits(index, 6)
            }

            if (type === 'item') {
                return `999999${manualData.shared.items[id]?.name ?? 'ZZZ'}`
            }

            return `555555${staticData.currencies[id]?.name ?? 'ZZZ'}`
        }
    )
}
