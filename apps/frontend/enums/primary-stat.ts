export enum PrimaryStat {
    None = 0,
    Agility = 1,
    Intellect = 2,
    Strength = 3,
    AgilityIntellect = 10,
    AgilityStrength = 11,
    IntellectStrength = 12,
    AgilityIntellectStrength = 13,
}

export const primaryStatToStats: Record<number, PrimaryStat[]> = {
    [PrimaryStat.Agility]: [
        PrimaryStat.Agility,
        PrimaryStat.AgilityIntellect,
        PrimaryStat.AgilityIntellectStrength,
        PrimaryStat.AgilityStrength,
    ],
    [PrimaryStat.Intellect]: [
        PrimaryStat.AgilityIntellect,
        PrimaryStat.AgilityIntellectStrength,
        PrimaryStat.Intellect,
        PrimaryStat.IntellectStrength,
    ],
    [PrimaryStat.Strength]: [
        PrimaryStat.AgilityIntellectStrength,
        PrimaryStat.AgilityStrength,
        PrimaryStat.IntellectStrength,
        PrimaryStat.Strength,
    ],
};
