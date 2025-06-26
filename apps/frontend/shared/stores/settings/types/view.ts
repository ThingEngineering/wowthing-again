export interface SettingsView {
    id: string;
    name: string;

    characterFilter: string;
    showCompletedUntrackedChores: boolean;

    groups: string[];
    groupBy: string[];
    sortBy: string[];

    commonFields: string[];
    homeFields: string[];

    homeCurrencies: number[];
    homeItems: number[];
    homeLockouts: number[];
    homeProgress: string[];
    homeTasks: string[];

    disabledChores: Record<string, string[]>;
}
