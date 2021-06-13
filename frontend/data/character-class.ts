import {CharacterClass} from '@/types'
import type {Dictionary} from '@/types'

export const classMap: Dictionary<CharacterClass> = {
    1: new CharacterClass(1, 'Warrior', [71, 72, 73]),
    2: new CharacterClass(1, 'Paladin', [65, 66, 70]),
    3: new CharacterClass(1, 'Hunter', [253, 254, 255]),
    4: new CharacterClass(1, 'Rogue', [259, 260, 261]),
    5: new CharacterClass(1, 'Priest', [256, 257, 258]),
    6: new CharacterClass(1, 'Death Knight', [250, 251, 252]),
    7: new CharacterClass(1, 'Shaman', [262, 263, 264]),
    8: new CharacterClass(1, 'Mage', [62, 63, 64]),
    9: new CharacterClass(1, 'Warlock', [265, 266, 267]),
    10: new CharacterClass(1, 'Monk', [268, 269, 270]),
    11: new CharacterClass(1, 'Druid', [102, 103, 104, 105]),
    12: new CharacterClass(1, 'Demon Hunter', [577, 581]),
}
