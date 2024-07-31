import type { Faction } from '@/enums/faction';
import type { PrimaryStat } from '@/enums/primary-stat';
import type { Role } from '@/enums/role';

export interface StaticDataCharacterClass {
    armorMask: number;
    id: number;
    name: string;
    rolesMask: number;
    slug: string;

    // calculated
    mask: number;
    specializationIds: number[];
}

export interface StaticDataCharacterRace {
    bit: number;
    faction: Faction;
    id: number;
    name: string;
    slug: string;
}

export interface StaticDataCharacterSpecialization {
    classId: number;
    id: number;
    name: string;
    order: number;
    primaryStat: PrimaryStat;
    role: Role;
}
