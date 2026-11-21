export interface SettingsView {
    id: string;
    name: string;

    characterFilter: string;
    limitTaskHeaderTooltipToGroup: boolean;
    showCompletedUntrackedChores: boolean;

    groups: string[];
    groupBy: string[];
    sortBy: string[];

    commonFields: string[];
    homeFields: string[];

    homeCurrencies: number[];
    homeItems: number[];
    homeLockouts: number[];
    homeProfessionsV2: string[];
    homeProgress: string[];
    homeTasks: string[];

    choreFilters: Record<string, string>;
    disabledChores: Record<string, string[]>;
}
