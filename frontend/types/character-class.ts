import type {ArmorType, WeaponType} from '@/types/enums'


export class CharacterClass {
    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public specializationIds: number[],
        public armorType: ArmorType,
        public weaponTypes: WeaponType[],
    )
    { }
}
