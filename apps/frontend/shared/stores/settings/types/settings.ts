import type { CharacterFlag } from '@/enums/character-flag';
import type { Language } from '@/enums/language';
import type { SettingsAccount } from './account';
import type { SettingsAuctionCategory } from './auction-category';
import type { SettingsTask } from './task';
import type { SettingsCustomGroup } from './custom-group';
import type { SettingsTag } from './tag';
import type { SettingsView } from './view';

export interface Settings {
    accounts: Record<number, SettingsAccount>;
    activeView: string;
    customGroups: SettingsCustomGroup[];
    customTasks: SettingsTask[];
    tags: SettingsTag[];
    views: SettingsView[];

    achievements: {
        showCharactersIfCompleted: boolean;
    };

    auctions: {
        customCategories: SettingsAuctionCategory[];
        ignoredRealms: number[];
        minimumExtraPetsValue: number;
    };

    characters: {
        defaultBackgroundId: number;
        defaultBackgroundBrightness: number;
        defaultBackgroundSaturation: number;
        hideDisabledAccounts: boolean;
        flags: Record<number, CharacterFlag>;
        hiddenCharacters: number[];
        ignoredCharacters: number[];
        pinnedCharacters: number[];
        disabledNameTooltip: string[];
    };

    collections: {
        hideFuture: boolean;
        hideUnavailable: boolean;
    };

    general: {
        desiredAccountName: string;
        language: Language;
        useEnglishRealmNames: boolean;
        useWowdb: boolean;
        // groupBy: string[]
        // sortBy: string[]
    };

    history: {
        hiddenRealms: number[];
    };

    layout: {
        includeArchaeology: boolean;
        newNavigation: boolean;
        newNavigationIcons: boolean;
        showEmptyLockouts: boolean;
        showPartialLevel: boolean;
        useClassColors: boolean;

        navigationAppearances: boolean;
        navigationCustomizations: boolean;
        navigationMounts: boolean;
        navigationPets: boolean;
        navigationToys: boolean;

        covenantColumn: 'current' | 'all';
        padding: 'small' | 'medium' | 'large';
        // commonFields: string[]
        // homeFields: string[]
        // homeLockouts: number[]
        // homeTasks: string[]
    };

    leaderboard: {
        anonymous: boolean;
        enabled: boolean;
    };

    privacy: {
        anonymized: boolean;
        public: boolean;
        publicAccounts: boolean;
        publicCurrencies: boolean;
        publicLockouts: boolean;
        publicMythicPlus: boolean;
        publicQuests: boolean;
        publicTransmog: boolean;
        showInLeaderboards: boolean;
    };

    professions: {
        dragonflightCountCraftingDrops: boolean;
        dragonflightCountGathering: boolean;
        dragonflightCountTasks: boolean;
        dragonflightTreatises: boolean;
        fullConcentrationIsBad: boolean;
        ignoreTasksWhenDoneWithTraits: boolean;

        collectingCharacters: Record<number, number>;
        collectingCharactersV2: Record<number, number[]>;
        cooldowns: Record<string, boolean>;
    };

    // tasks: {
    //     disabledChores: Record<string, string[]>
    // }

    transmog: {
        [index: string]: boolean;

        completionistMode: boolean;
        completionistSets: boolean;

        showAllianceOnly: boolean;
        showHordeOnly: boolean;

        showDeathKnight: boolean;
        showDemonHunter: boolean;
        showDruid: boolean;
        showEvoker: boolean;
        showHunter: boolean;
        showMage: boolean;
        showMonk: boolean;
        showPaladin: boolean;
        showPriest: boolean;
        showRogue: boolean;
        showShaman: boolean;
        showWarlock: boolean;
        showWarrior: boolean;
    };
}
