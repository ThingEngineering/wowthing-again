import { Expansion } from '@/types'


export const expansionMap: Record<number, Expansion> = {
    0: new Expansion(0, 'Classic', 'classic'),
    1: new Expansion(1, 'The Burning Crusade', 'the-burning-crusade'),
    2: new Expansion(2, 'Wrath of the Lich King', 'wrath-of-the-lich-king'),
    3: new Expansion(3, 'Cataclysm', 'cataclysm'),
    4: new Expansion(4, 'Mists of Pandaria', 'mists-of-pandaria'),
    5: new Expansion(5, 'Warlords of Draenor', 'warlords-of-draenor'),
    6: new Expansion(6, 'Legion', 'legion'),
    7: new Expansion(7, 'Battle for Azeroth', 'battle-for-azeroth'),
    8: new Expansion(8, 'Shadowlands', 'shadowlands'),
}
