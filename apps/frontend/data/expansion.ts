import sortBy from 'lodash/sortBy';

import { ExpansionData } from '@/types';

export const expansionMap: Record<number, ExpansionData> = Object.fromEntries(
    [
        new ExpansionData(0, 'Classic', 'classic', 'Classic'),
        new ExpansionData(1, 'Burning Crusade', 'burning-crusade', 'TBC'),
        new ExpansionData(2, 'Wrath of the Lich King', 'wrath-of-the-lich-king', 'WotLK'),
        new ExpansionData(3, 'Cataclysm', 'cataclysm', 'Cata'),
        new ExpansionData(4, 'Mists of Pandaria', 'mists-of-pandaria', 'MoP'),
        new ExpansionData(5, 'Warlords of Draenor', 'warlords-of-draenor', 'WoD'),
        new ExpansionData(6, 'Legion', 'legion', 'Legion'),
        new ExpansionData(7, 'Battle for Azeroth', 'battle-for-azeroth', 'BfA'),
        new ExpansionData(8, 'Shadowlands', 'shadowlands', 'SL'),
        new ExpansionData(9, 'Dragonflight', 'dragonflight', 'DF'),
        new ExpansionData(10, 'The War Within', 'war-within', 'TWW'),
        new ExpansionData(11, 'Midnight', 'midnight', 'Mid'),
    ].map((exp) => [exp.id, exp])
);

export const expansionSlugMap: Record<string, ExpansionData> = Object.fromEntries(
    Object.values(expansionMap).map((expansion) => [expansion.slug, expansion])
);

export const expansionShortNameMap: Record<string, ExpansionData> = Object.fromEntries(
    Object.values(expansionMap).map((expansion) => [
        expansion.shortName.toLocaleLowerCase(),
        expansion,
    ])
);

export const expansionOrder: ExpansionData[] = sortBy(
    Object.values(expansionMap),
    (expansion) => expansion.id
);

export const expansionOrderMap: Record<number, number> = Object.fromEntries(
    expansionOrder.map((expansion, index) => [expansion.id, index])
);

export const expansionReverseOrder = expansionOrder.slice();
expansionReverseOrder.reverse();

export const maxExpansionId = expansionOrder[expansionOrder.length - 1].id;
