import sortBy from 'lodash/sortBy';

import { Expansion } from '@/types';

export const expansionMap: Record<number, Expansion> = Object.fromEntries(
    [
        new Expansion(0, 'Classic', 'classic', 'Classic'),
        new Expansion(1, 'Burning Crusade', 'burning-crusade', 'TBC'),
        new Expansion(2, 'Wrath of the Lich King', 'wrath-of-the-lich-king', 'WotLK'),
        new Expansion(3, 'Cataclysm', 'cataclysm', 'Cata'),
        new Expansion(4, 'Mists of Pandaria', 'mists-of-pandaria', 'MoP'),
        new Expansion(5, 'Warlords of Draenor', 'warlords-of-draenor', 'WoD'),
        new Expansion(6, 'Legion', 'legion', 'Legion'),
        new Expansion(7, 'Battle for Azeroth', 'battle-for-azeroth', 'BfA'),
        new Expansion(8, 'Shadowlands', 'shadowlands', 'SL'),
        new Expansion(9, 'Dragonflight', 'dragonflight', 'DF'),
        new Expansion(10, 'The War Within', 'war-within', 'TWW'),
    ].map((exp) => [exp.id, exp]),
);

export const expansionSlugMap: Record<string, Expansion> = Object.fromEntries(
    Object.values(expansionMap).map((expansion) => [expansion.slug, expansion]),
);

export const expansionOrder: Expansion[] = sortBy(
    Object.values(expansionMap),
    (expansion) => expansion.id,
);

export const expansionOrderMap: Record<number, number> = Object.fromEntries(
    expansionOrder.map((expansion, index) => [expansion.id, index]),
);

export const expansionReverseOrder = expansionOrder.slice();
expansionReverseOrder.reverse();

export const maxExpansionId = expansionOrder[expansionOrder.length - 1].id;
