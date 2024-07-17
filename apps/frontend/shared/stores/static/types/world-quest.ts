import type { Faction } from '@/enums/faction';

export class StaticDataWorldQuest {
    constructor(
        public id: number,
        public expansion: number,
        public questInfoId: number,
        public faction: Faction,
        public minLevel: number,
        public maxLevel: number,
        public name: string,
        public needQuestIds?: number[],
        public skipQuestIds?: number[],
    ) {}
}

export type StaticDataWorldQuestArray = ConstructorParameters<typeof StaticDataWorldQuest>;
