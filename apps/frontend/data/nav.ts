import { lazyState } from '@/user-home/state/lazy';
import { userState } from '@/user-home/state/user';
import type { Settings } from '@/shared/stores/settings/types';

type NavItem = {
    path: string;
    text: string;
    icon: string;
    privateOnly?: boolean;
    showFunc?: (settings: Settings) => boolean;
    percentFunc?: () => number;
};

export const navItems: NavItem[] = [
    {
        path: '',
        text: 'Home',
        icon: 'mdiHomeOutline',
    },
    null,
    {
        path: 'characters/',
        text: 'Characters',
        icon: 'mdiAccountGroupOutline',
    },
    {
        path: 'currencies/',
        text: 'Currencies',
        icon: 'gameCash',
        privateOnly: true,
    },
    {
        path: 'items/',
        text: 'Items',
        icon: 'gameBackpack',
    },
    {
        path: 'lockouts',
        text: 'Lockouts',
        icon: 'gameLockedFortress',
    },
    {
        path: 'mythic-plus/',
        text: 'Mythic+',
        icon: 'icSharpMoreTime',
    },
    {
        path: 'professions/',
        text: 'Professions',
        icon: 'mdiHammerWrench',
    },
    {
        path: 'progress/',
        text: 'Progress',
        icon: 'mdiProgressQuestion',
    },
    {
        path: 'reputations/',
        text: 'Reputations',
        icon: 'mdiAccountStarOutline',
    },
    null,
    {
        path: 'collections/',
        text: 'Collections',
        icon: 'gameCompanionCube',
    },
    {
        path: 'appearances/',
        text: 'Appearances',
        icon: 'gameClothes',
        showFunc: (settings) => settings.layout.navigationAppearances,
        percentFunc: () => lazyState.appearances.stats.OVERALL?.percent || 0,
    },
    {
        path: 'customizations/',
        text: 'Customizations',
        icon: 'gameTotemHead',
        showFunc: (settings) => settings.layout.navigationCustomizations,
        percentFunc: () => lazyState.customizations?.OVERALL?.percent || 0,
    },
    {
        path: 'mounts/',
        text: 'Mounts',
        icon: 'mdiUnicorn',
        showFunc: (settings) => settings.layout.navigationMounts,
        percentFunc: () => userState.mounts?.stats?.OVERALL?.percent || 0,
    },
    {
        path: 'pets/',
        text: 'Pets',
        icon: 'mdiDuck',
        showFunc: (settings) => settings.layout.navigationPets,
        percentFunc: () => userState.pets?.stats?.OVERALL?.percent || 0,
    },
    {
        path: 'toys/',
        text: 'Toys',
        icon: 'mdiDiceMultiple',
        showFunc: (settings) => settings.layout.navigationToys,
        percentFunc: () => userState.toys?.stats?.OVERALL?.percent || 0,
    },
    null,
    {
        path: 'journal/',
        text: 'Journal',
        icon: 'gameSecretBook',
    },
    {
        path: 'sets/',
        text: 'Sets',
        icon: 'gameHanger',
    },
    {
        path: 'vendors/',
        text: 'Vendors',
        icon: 'mdiCartOutline',
    },
    {
        path: 'zone-maps/',
        text: 'Zone Maps',
        icon: 'gameTreasureMap',
    },
    null,
    {
        path: 'auctions/',
        text: 'Auctions',
        icon: 'mdiBank',
        privateOnly: true,
    },
    {
        path: 'history/',
        text: 'History',
        icon: 'mdiChartLine',
        privateOnly: true,
    },
    {
        path: 'matrix',
        text: 'Matrix',
        icon: 'carbonScatterMatrix',
    },
    null,
    {
        path: 'achievements/',
        text: 'Achievements',
        icon: 'gameTrophy',
    },
    {
        path: 'world-quests/',
        text: 'World Quests',
        icon: 'emojiConstruction',
    },
    null,
    {
        path: 'settings/',
        text: 'Settings',
        icon: 'mdiCogOutline',
        privateOnly: true,
    },
];
