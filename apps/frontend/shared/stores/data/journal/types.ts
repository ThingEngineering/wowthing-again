import type { JournalDataInstance, JournalDataTier } from '@/types/data';

export interface RawJournal {
    itemExpansion: Record<number, number[]>;
    tiers: JournalDataTier[];
    tokenEncounters: string[];
}

export class DataJournal {
    public itemExpansion: Record<number, number[]> = {};
    public tiers: JournalDataTier[] = [];
    public tokenEncounters: string[] = [];

    public expandedItem: Record<number, number[]> = {};
    public instanceById: Record<number, JournalDataInstance> = {};
}
