type NavItem = [string, string, string, boolean?]

export const navItems: NavItem[] = [
    ['', 'Home', 'mdiHomeOutline'],
    [null, null, null],
    
    ['characters/', 'Characters', 'mdiAccountGroupOutline'],
    ['currencies/', 'Currencies', 'gameCash', true],
    ['items/', 'Items', 'gameBackpack'],
    ['lockouts', 'Lockouts', 'gameLockedFortress'],
    ['mythic-plus/', 'Mythic+', 'icSharpMoreTime'],
    ['professions/', 'Professions', 'mdiHammerWrench'],
    ['progress/', 'Progress', 'mdiProgressQuestion'],
    ['reputations/', 'Reputations', 'mdiAccountStarOutline'],
    [null, null, null],
    
    ['collections/', 'Collections', 'gameCompanionCube'],
    // ['appearances/', 'Appearances', 'emojiConstruction'],
    // ['heirlooms/', 'Heirlooms', 'emojiConstruction'],
    // ['illusions/', 'Illusions', 'mdiAutoFix'],
    // ['mounts/', 'Mounts', 'mdiUnicorn'],
    // ['pets/', 'Pets', 'mdiDuck'],
    // ['toys/', 'Toys', 'mdiDiceMultiple'],
    ['journal/', 'Journal', 'gameSecretBook'],
    ['sets/', 'Sets', 'gameHanger'],
    ['vendors/', 'Vendors', 'mdiCartOutline'],
    ['zone-maps/', 'Zone Maps', 'gameTreasureMap'],
    [null, null, null],
    
    ['auctions/', 'Auctions', 'mdiBank', true],
    ['history/', 'History', 'mdiChartLine', true],
    ['matrix', 'Matrix', 'carbonScatterMatrix'],
    [null, null, null],
    
    ['achievements/', 'Achievements', 'gameTrophy'],
    ['world-quests/', 'World Quests', 'emojiConstruction'],
    [null, null, null],

    ['settings/', 'Settings', 'mdiCogOutline', true],
]
