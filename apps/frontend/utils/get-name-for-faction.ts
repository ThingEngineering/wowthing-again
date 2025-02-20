export function getNameForFaction(name: string, faction: number): string {
    const names = name.split('|');
    return names[faction] || names[0];
}
