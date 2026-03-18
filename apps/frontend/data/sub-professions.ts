import { Expansion } from '@/enums/expansion';
import { Profession } from '@/enums/profession';

export const expansionSubProfession: Record<number, Record<Profession, number>> = {
    [Expansion.Midnight]: {
        [Profession.Alchemy]: 2906,
        [Profession.Archaeology]: null,
        [Profession.Blacksmithing]: 2907,
        [Profession.Cooking]: 2908,
        [Profession.Enchanting]: 2909,
        [Profession.Engineering]: 2910,
        [Profession.Fishing]: 2911,
        [Profession.Herbalism]: 2912,
        [Profession.Inscription]: 2913,
        [Profession.Jewelcrafting]: 2914,
        [Profession.Leatherworking]: 2915,
        [Profession.Mining]: 2916,
        [Profession.Skinning]: 2917,
        [Profession.Tailoring]: 2918,
    },
};
