import {TransmogSetData} from '@/types'
import type {Dictionary} from '@/types'

const transmogSets: Dictionary<TransmogSetData[]> = {
    'all': [
        new TransmogSetData('all', 12),
    ],
    'armor': [
        new TransmogSetData('cloth', 3, 'Cloth'),
        new TransmogSetData('leather', 4, 'Leather'),
        new TransmogSetData('mail', 2, 'Mail'),
        new TransmogSetData('plate', 3, 'Plate'),
    ],
    'class': [
        new TransmogSetData('mage', 1, 'Mage'),
        new TransmogSetData('priest', 1, 'Priest'),
        new TransmogSetData('warlock', 1, 'Warlock'),
        new TransmogSetData('demon-hunter', 1, 'Demon Hunter'),
        new TransmogSetData('druid', 1, 'Druid'),
        new TransmogSetData('monk', 1, 'Monk'),
        new TransmogSetData('rogue', 1, 'Rogue'),
        new TransmogSetData('hunter', 1, 'Hunter'),
        new TransmogSetData('shaman', 1, 'Shaman'),
        new TransmogSetData('death-knight', 1, 'Death Knight'),
        new TransmogSetData('paladin', 1, 'Paladin'),
        new TransmogSetData('warrior', 1, 'Warrior'),
    ],

}

export { transmogSets }
