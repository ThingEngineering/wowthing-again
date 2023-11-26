import { RewardType } from '@/enums/reward-type'
import { TransmogSetType } from '@/enums/transmog-set-type'
import { TransmogSet, TransmogSetData } from '@/types'


export const transmogTypes = new Set<RewardType>([
    RewardType.Armor,
    RewardType.Cosmetic,
    RewardType.Transmog,
    RewardType.Weapon,
])

const transmogSets: Record<string, TransmogSet> = {
    'all': new TransmogSet('all', [
        new TransmogSetData('all', 13),
    ]),
    'armor': new TransmogSet('armor', [
        new TransmogSetData('cloth', 3, 'Cloth'),
        new TransmogSetData('leather', 4, 'Leather'),
        new TransmogSetData('mail', 3, 'Mail'),
        new TransmogSetData('plate', 3, 'Plate'),
    ]),
    'class': new TransmogSet('class', [
        new TransmogSetData('mage', 1, 'Mage'),
        new TransmogSetData('priest', 1, 'Priest'),
        new TransmogSetData('warlock', 1, 'Warlock'),
        new TransmogSetData('demon-hunter', 1, 'Demon Hunter'),
        new TransmogSetData('druid', 1, 'Druid'),
        new TransmogSetData('monk', 1, 'Monk'),
        new TransmogSetData('rogue', 1, 'Rogue'),
        new TransmogSetData('evoker', 1, 'Evoker'),
        new TransmogSetData('hunter', 1, 'Hunter'),
        new TransmogSetData('shaman', 1, 'Shaman'),
        new TransmogSetData('death-knight', 1, 'Death Knight'),
        new TransmogSetData('paladin', 1, 'Paladin'),
        new TransmogSetData('warrior', 1, 'Warrior'),
    ]),
    'covenant-korthia': new TransmogSet('covenant', [
        new TransmogSetData('kyrian', 1, 'Kyrian'),
        new TransmogSetData('necrolord', 1, 'Necrolord'),
        new TransmogSetData('night-fae', 1, 'Night Fae'),
        new TransmogSetData('venthyr', 1, 'Venthyr'),
        new TransmogSetData('venthyr2', 1, 'Venthyr'),
    ]),
}

transmogSets[TransmogSetType.Armor] = transmogSets['armor']
transmogSets[TransmogSetType.Class] = transmogSets['class']
transmogSets[TransmogSetType.Covenant] = transmogSets['covenant']

export { transmogSets }
