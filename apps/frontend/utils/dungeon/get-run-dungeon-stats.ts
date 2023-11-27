import type { CharacterMythicPlusAddonRun } from '@/types'


export function getRunDungeonStats(runs: CharacterMythicPlusAddonRun[]): Record<number, number> {
    const mapIdCount: Record<number, number> = {}
    for (const run of (runs || [])) {
        mapIdCount[run.mapId] = (mapIdCount[run.mapId] || 0) + 1
    }
    return mapIdCount
}
