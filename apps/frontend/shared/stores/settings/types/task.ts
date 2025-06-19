import type { DbResetType } from '@/shared/stores/db/enums';

export interface SettingsTask {
    key: string;
    maximumLevel?: number;
    minimumLevel?: number;
    name: string;
    questIds: number[];
    questReset: DbResetType;
    shortName: string;
}
