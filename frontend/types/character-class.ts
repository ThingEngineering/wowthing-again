import type { ArmorType, PrimaryStat, WeaponType } from '@/types/enums'


export class CharacterClass {
    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public specializationIds: number[],
        public primaryStats: PrimaryStat[],
        public armorType: ArmorType,
        public weaponTypes: WeaponType[],
    )
    { }
}
