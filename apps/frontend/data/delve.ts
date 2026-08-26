export type Delve = {
    name: string;
    shortName: string;
    storyRanks: Record<string, number>;
};

// Defaults, only used for initial settings creation
export const delveMap: Record<number, Delve> = {
    8426: {
        name: 'Collegiate Calamity',
        shortName: 'CC',
        storyRanks: {
            'Academic Antitoxin': 3, // 12.1
            'Academy Under Siege': 4,
            'Faculty of Fear': 3,
            'Invasive Glow': 5,
        },
    },
    8428: {
        name: 'Parhelion Plaza',
        shortName: 'PP',
        storyRanks: {
            'Bombing Run': 0,
            'Caustic Crush': 3, // 12.1
            'Holding the Line': 4,
            'March of the Arcane Brigade': 0,
        },
    },
    8430: {
        name: 'Sunkiller Sanctum',
        shortName: 'SS',
        storyRanks: {
            'Core of the Problem': 3,
            'Not What I Expected': 3,
            'The Gravitational Effect': 3,
        },
    },
    8432: {
        name: 'Shadowguard Point',
        shortName: 'SP',
        storyRanks: {
            'Basilisk Blitz': 3, // 12.1
            Calamitous: 3,
            'Captured Wildlife': 0,
            'Stolen Mana': 0,
        },
    },
    8434: {
        name: 'The Grudge Pit',
        shortName: 'GP',
        storyRanks: {
            'Arena Champion': 3,
            'Dastardly Rotstalk': 3,
            'Fungal Pharmacon': 3, // 12.1
            'Lightbloom Invasion': 3,
        },
    },
    8436: {
        name: 'The Gulf of Memory',
        shortName: 'GM',
        storyRanks: {
            'Alnmoth Munchies': 3,
            'Descent of the Haranir': 3,
            'Sporasaur Special': 4,
        },
    },
    8438: {
        name: 'The Shadow Enclave',
        shortName: 'SE',
        storyRanks: {
            'Infiltrate and Ameliorate': 3, // 12.1
            'Mirror Shine': 0,
            'Shadowy Supplies': 3,
            "Traitor's Due": 3,
        },
    },
    8440: {
        name: 'The Darkway',
        shortName: 'DW',
        storyRanks: {
            'Focusers Under Pressure': 3,
            'Leyline Technician': 3,
            'Ogre Powered': 4,
        },
    },
    8442: {
        name: 'Twilight Crypts',
        shortName: 'TC',
        storyRanks: {
            'Loosed Loa': 3,
            'Party Crasher': 3,
            'Trapped!': 3,
            "Why'd It Have to Be Snakes?": 3, // 12.1
        },
    },
    8444: {
        name: "Atal'Aman",
        shortName: 'AA',
        storyRanks: {
            'Ritual Interrupted': 3,
            'Toadly Unbecoming': 3,
            'Totem Annihilation': 3,
            'Venomous Vapors': 3, // 12.1
        },
    },
    8760: {
        name: 'The Ring of Glory',
        shortName: 'RG',
        storyRanks: {
            'Adopt-a-thon': 1, // killing the boss twice??
            'Game Day': 3,
            'Open Night': 3,
        },
    },
    8763: {
        name: 'Gnarldor Isle',
        shortName: 'GI',
        storyRanks: {
            "Minchi's Osseous Adventure": 2,
            'Olds and Ends': 3,
            'Speaking Their Language': 3,
        },
    },
};
