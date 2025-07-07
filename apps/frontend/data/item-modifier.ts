export const itemModifierMap: Record<number, [string, string, number?]> = {
    0: ['Normal', 'N'],
    1: ['Heroic', 'H', 7980],
    3: ['Mythic', 'M', 7981],
    4: ['Raid Finder', 'L', 7982],

    6: ['Base', 'T1'],
    7: ['Impressive', 'T2'],
    8: ['Remarkable', 'T3'],

    153: ['Raid Finder (Fancy)', 'L🌟'],
    154: ['Normal (Fancy)', 'N🌟'],
    155: ['Heroic (Fancy)', 'H🌟'],
    156: ['Mythic (Fancy)', 'M🌟'],
    159: ['PvP', 'P', 9426],
    160: ['Elite PvP', 'E', 9821],
};

export const itemModifierOrder: Record<number, number> = {
    156: 41, // Mythic Fancy
    3: 40, // Mythic
    155: 31, // Heroic Fancy
    1: 30, // Heroic
    154: 21, // Normal Fancy
    0: 20, // Normal
    153: 11, // LFR Fancy
    4: 10, // LFR
};
