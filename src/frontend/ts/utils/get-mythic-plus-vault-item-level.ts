import { keyVaultItemLevel } from '../data/dungeon'

export default function getMythicPlusVaultItemLevel(level: number): number {
    for (let i = 0; i < keyVaultItemLevel.length; i++) {
        const thing = keyVaultItemLevel[i]
        if (level >= thing[0]) {
            return thing[1]
        }
    }

    return 0
}
