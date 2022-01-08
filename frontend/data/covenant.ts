import fromPairs from 'lodash/fromPairs'

import { Covenant } from '@/types'

export const covenantMap: Record<number, Covenant> = {
    1: new Covenant(1, 'Kyrian', 'kyrian', 'covenant_kyrian'),
    2: new Covenant(2, 'Venthyr', 'venthyr', 'covenant_venthyr'),
    3: new Covenant(3, 'Night Fae', 'night-fae', 'covenant_night_fae'),
    4: new Covenant(4, 'Necrolord', 'necrolord', 'covenant_necrolord'),
}

export const covenantOrder: number[] = [
    1, // Kyrian
    4, // Necrolord
    3, // Night Fae
    2, // Venthyr
]

export const covenantNameMap = Object.fromEntries(
    Object.entries(covenantMap).map(([, covenant]) => [covenant.name, covenant])
)

export const covenantSlugMap: Record<string, Covenant> =
    fromPairs(Object.values(covenantMap).map(c => [c.slug, c]))

export const covenantFeatureOrder: [string, string, number][] = [
    ['conductor', 'Anima Conductor', 3],
    ['missions', 'Command Table', 3],
    ['transport', 'Transport Network', 3],
    ['unique', 'Unique Feature', 5],
]
