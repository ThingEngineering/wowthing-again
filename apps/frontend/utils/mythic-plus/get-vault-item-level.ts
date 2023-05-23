import { keyVaultItemLevel } from '@/data/dungeon'


export function getVaultItemLevel(level: number): number[] {
    for (let i = 0; i < keyVaultItemLevel.length; i++) {
        const thing = keyVaultItemLevel[i]
        if (level >= thing[0]) {
            return thing.slice(1)
        }
    }

    return [0, 0]
}
