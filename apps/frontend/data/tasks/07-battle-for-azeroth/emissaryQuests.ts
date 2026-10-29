import { Holiday } from '@/enums/holiday';
import type { Task } from '@/types/tasks';
import { emissaryChoreData } from '../utils';

export const bfaEmissaryQuests: Task = {
    key: 'bfaEmissaryQuests',
    name: '[BfA] Emissaries',
    shortName: 'BfA',
    showExpiry: true,
    showRowStars: true,
    showSeparate: true,
    sortByExpiry: true,
    chores: [
        {
            key: 'champions',
            name: 'Champions of Azeroth',
            icon: '{factionIcon:BfaChampionsOfAzeroth}',
            ...emissaryChoreData(Holiday.EmissaryChampionsAzeroth),
        },
        {
            key: 'tortollans',
            name: 'Tortollans',
            icon: '{factionIcon:BfaTortollans}',
            ...emissaryChoreData(Holiday.EmissaryTortollans),
        },
        {
            key: 'proudmooreZandalari',
            name: 'Proudmoore/Zandalari',
            icon: '{factionIcon:BfaProudmooreAdmiralty} {factionIcon:BfaZandalariEmpire}',
            ...emissaryChoreData(Holiday.EmissaryProudmooreZandalari),
        },
        {
            key: 'embersVoldunai',
            name: 'Embers/Voldunai',
            icon: '{factionIcon:BfaOrderOfEmbers} {factionIcon:BfaVoldunai}',
            ...emissaryChoreData(Holiday.EmissaryEmbersVoldunai),
        },
        {
            key: 'stormsTalanjis',
            name: "Storm's/Talanji's",
            icon: '{factionIcon:BfaStormsWake} {factionIcon:BfaTalanjisExpedition}',
            ...emissaryChoreData(Holiday.EmissaryStormsTalanjis),
        },
        {
            key: 'legionHonorbound',
            name: 'Legion/Honorbound',
            icon: '{factionIcon:Bfa7thLegion} {factionIcon:BfaTheHonorbound}',
            ...emissaryChoreData(Holiday.EmissaryLegionHonorbound),
        },
        {
            key: 'wavebladeUnshackled',
            name: 'Waveblade/Unshackled',
            icon: '{factionIcon:BfaWavebladeAnkoan} {factionIcon:BfaTheUnshackled}',
            ...emissaryChoreData(Holiday.EmissaryWavebladeUnshackled),
        },
    ],
};
