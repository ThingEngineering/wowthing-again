import fromPairs from 'lodash/fromPairs'

import { Covenant } from '@/types'
import type { Dictionary } from '@/types'

export const covenantMap: Dictionary<Covenant> = {
    1: new Covenant(1, 'Kyrian', 'kyrian', 'covenant_kyrian'),
    2: new Covenant(2, 'Venthyr', 'venthyr', 'covenant_venthyr'),
    3: new Covenant(3, 'Night Fae', 'night-fae', 'covenant_night_fae'),
    4: new Covenant(4, 'Necrolord', 'necrolord', 'covenant_necrolord'),
}

export const covenantSlugMap: Record<string, Covenant> =
    fromPairs(Object.values(covenantMap).map(c => [c.slug, c]))
