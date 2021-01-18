import {Dungeon} from '../types'
import type {Dictionary} from '../types'

const dungeonMap: Dictionary<Dungeon> = {
    375: new Dungeon(375, 'Mists of Tirna Scithe', 'MTS', 'dungeon_mists_of_tirna_scithe'),
    376: new Dungeon(376, 'The Necrotic Wake', 'NW', 'dungeon_the_necrotic_wake'),
    377: new Dungeon(377, 'De Other Side', 'DOS', 'dungeon_de_other_side'),
    378: new Dungeon(378, 'Halls of Atonement', 'HoA', 'dungeon_halls_of_atonement'),
    379: new Dungeon(379, 'Plaguefall', 'PF', 'dungeon_plaguefall'),
    380: new Dungeon(380, 'Sanguine Depths', 'SD', 'dungeon_sanguine_depths'),
    381: new Dungeon(381, 'Spires of Ascension', 'SoA', 'dungeon_spires_of_ascension'),
    382: new Dungeon(382, 'Theater of Pain', 'ToP', 'dungeon_theater_of_pain'),
}

const orderBattleForAzeroth: number[] = [
]

const orderShadowlands: number[] = [
    377,
    378,
    375,
    376,
    379,
    380,
    381,
    382,
]

const seasonDungeonOrder: Dictionary<number[]> = {
    1: orderBattleForAzeroth,
    2: orderBattleForAzeroth,
    3: orderBattleForAzeroth,
    4: orderBattleForAzeroth,
    5: orderShadowlands,
}

export {
    dungeonMap,
    orderBattleForAzeroth,
    orderShadowlands,
    seasonDungeonOrder,
}
