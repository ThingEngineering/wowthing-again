import { Holiday } from '@/enums/holiday';
import type { Task } from '@/types/tasks';
import { emissaryChoreData } from '../utils';

export const legionEmissaryQuests: Task = {
    key: 'legionEmissaryQuests',
    name: '[Legion] Emissaries',
    shortName: 'Leg',
    showSeparate: true,
    chores: [
        {
            key: 'courtFarondis',
            name: 'Court of Farondis',
            icon: '{factionIcon:LegionCourtOfFarondis}',
            ...emissaryChoreData(Holiday.EmissaryCourtFarondis),
        },
        {
            key: 'dreamweavers',
            name: 'Dreamweavers',
            icon: '{factionIcon:LegionDreamweavers}',
            ...emissaryChoreData(Holiday.EmissaryDreamweavers),
        },
        {
            key: 'highmountain',
            name: 'Highmountain Tribes',
            icon: '{factionIcon:LegionHighmountainTribes}',
            ...emissaryChoreData(Holiday.EmissaryHighmountainTribes),
        },
        {
            key: 'nightfallen',
            name: 'Nightfallen',
            icon: '{factionIcon:LegionNightfallen}',
            ...emissaryChoreData(Holiday.EmissaryNightfallen),
        },
        {
            key: 'valarjar',
            name: 'Valarjar',
            icon: '{factionIcon:LegionValarjar}',
            ...emissaryChoreData(Holiday.EmissaryValarjar),
        },
        {
            key: 'wardens',
            name: 'Wardens',
            icon: '{factionIcon:LegionWardens}',
            ...emissaryChoreData(Holiday.EmissaryWardens),
        },
        {
            key: 'armiesLegionfall',
            name: 'Armies of Legionfall',
            icon: '{factionIcon:LegionArmiesOfLegionfall}',
            ...emissaryChoreData(Holiday.EmissaryArmiesLegionfall),
        },
        {
            key: 'argussianReach',
            name: 'Argussian Reach',
            icon: '{factionIcon:LegionArgussianReach}',
            ...emissaryChoreData(Holiday.EmissaryArgussianReach),
        },
        {
            key: 'armyLight',
            name: 'Army of Light',
            icon: '{factionIcon:LegionArmyOfLight}',
            ...emissaryChoreData(Holiday.EmissaryArmyLight),
        },
    ],
};
