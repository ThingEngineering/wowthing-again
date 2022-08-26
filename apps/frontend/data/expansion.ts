import sortBy from 'lodash/sortBy'

import { Expansion } from '@/types'


export const expansionMap: Record<number, Expansion> = {
    0: new Expansion(0, 'Classic', 'classic', 'Classic'),
    1: new Expansion(1, 'The Burning Crusade', 'the-burning-crusade', 'TBC'),
    2: new Expansion(2, 'Wrath of the Lich King', 'wrath-of-the-lich-king', 'WotLK'),
    3: new Expansion(3, 'Cataclysm', 'cataclysm', 'Cata'),
    4: new Expansion(4, 'Mists of Pandaria', 'mists-of-pandaria', 'MoP'),
    5: new Expansion(5, 'Warlords of Draenor', 'warlords-of-draenor', 'WoD'),
    6: new Expansion(6, 'Legion', 'legion', 'Legion'),
    7: new Expansion(7, 'Battle for Azeroth', 'battle-for-azeroth', 'BfA'),
    8: new Expansion(8, 'Shadowlands', 'shadowlands', 'SL'),
}

export const expansionReverseOrder: Expansion[] = sortBy(
    Object.values(expansionMap),
    (expansion) => -expansion.id
)
