import { PetFlags } from '@/enums/pet-flags';

export class StaticDataPet {
    constructor(
        public id: number,
        public flags: number,
        public sourceType: number,
        public petType: number,
        public creatureId: number,
        public spellId: number,
        public name: string,
        public itemIds: number[],
    ) {}

    get canBattle(): boolean {
        return (this.flags & PetFlags.CantBattle) === 0;
    }

    get allianceOnly(): boolean {
        return (this.flags & PetFlags.AllianceOnly) > 0;
    }

    get hordeOnly(): boolean {
        return (this.flags & PetFlags.HordeOnly) > 0;
    }
}
export type StaticDataPetArray = ConstructorParameters<typeof StaticDataPet>;
