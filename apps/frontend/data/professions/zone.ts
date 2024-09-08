import type { Profession } from '@/enums/profession';

export type ProfessionZone = {
    name: string;
    shortName: string;
    icon: string;
    map?: string;
    masters?: Profession[];
    reputationId?: number;
};
