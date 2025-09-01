import type { DbResetType } from '@/shared/stores/db/enums';

export interface SettingsTask {
    key: string;
    name: string;
    shortName: string;
    maximumLevel?: number;
    minimumLevel?: number;
    requiredQuestId?: number;
    questIds: number[];
    questReset: DbResetType;
}
