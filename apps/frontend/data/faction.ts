export const factionMap: Record<string, number> = {
    alliance: 0,
    horde: 1,
};

export const factionIdMap: Record<number, string> = Object.fromEntries(
    Object.entries(factionMap).map(([slug, id]) => [id, slug]),
);
