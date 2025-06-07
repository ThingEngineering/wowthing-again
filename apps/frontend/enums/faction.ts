export enum Faction {
    Alliance = 0,
    Horde = 1,
    Neutral = 2,
    Both = 10,
}

export const factionValues: string[] = Object.keys(Faction).filter(
    (faction) => !isNaN(Number(faction)),
);
