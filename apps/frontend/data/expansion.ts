import sortBy from 'lodash/sortBy'

import { Expansion } from '@/types'


export const expansionMap: Record<number, Expansion> = {
    0: new Expansion(0, 'Classic', 'classic', 'Classic'),
    1: new Expansion(1, 'Burning Crusade', 'burning-crusade', 'TBC'),
    2: new Expansion(2, 'Wrath of the Lich King', 'wrath-of-the-lich-king', 'WotLK'),
    3: new Expansion(3, 'Cataclysm', 'cataclysm', 'Cata'),
    4: new Expansion(4, 'Mists of Pandaria', 'mists-of-pandaria', 'MoP'),
    5: new Expansion(5, 'Warlords of Draenor', 'warlords-of-draenor', 'WoD'),
    6: new Expansion(6, 'Legion', 'legion', 'Legion'),
    7: new Expansion(7, 'Battle for Azeroth', 'battle-for-azeroth', 'BfA'),
    8: new Expansion(8, 'Shadowlands', 'shadowlands', 'SL'),
    9: new Expansion(9, 'Dragonflight', 'dragonflight', 'DF'),
}

export const expansionSlugMap: Record<string, Expansion> = Object.fromEntries(
    Object.values(expansionMap)
        .map((expansion) => [expansion.slug, expansion])
)

export const expansionOrder: Expansion[] = sortBy(
    Object.values(expansionMap),
    (expansion) => -expansion.id
)

export const expansionOrderMap: Record<number, number> = Object.fromEntries(
    expansionOrder.map((expansion, index) => [expansion.id, index])
)

export const expansionReverseOrder = expansionOrder.slice()
expansionReverseOrder.reverse()
